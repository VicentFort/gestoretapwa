<template>
  <v-container>
    <v-form @submit.prevent="submitForm" ref="form" v-model="valid">
      <v-card class="pa-4">
        <v-card-title class="font-weight-bold text-center">
          Bescanvi de tiquet per QR
        </v-card-title>

        <v-col cols="12">
          <v-select
            v-model="selectedStore"
            :items="displayedStores"
            :item-props="storeProps"
            item-title="name" 
            item-value="id"
            :disabled="displayedStores.length === 0"
            label="Magatzem"
          />
        </v-col>

        <v-col cols="12" class="text-center">
          <div v-if="isMobile">
            <v-btn
              :color="scanning ? 'error' : 'primary'"
              prepend-icon="mdi-camera"
              block
              @click="toggleScanner"
            >
              {{ scanning ? "Aturar Escàner" : "Escanejar Codi QR" }}
            </v-btn>

            <div
              v-show="scanning"
              id="qr-reader"
              class="overflow-hidden mt-4 mx-auto rounded-lg elevation-2"
              style="max-width: 320px"
            ></div>
          </div>
          <v-alert
            v-else
            type="warning"
            variant="tonal"
            text="El bescanvi per QR només està disponible en dispositius mòbils."
          />
        </v-col>

        <v-col cols="12" v-if="scannedData">
          <v-card variant="tonal" color="success" class="text-center pa-3">
            <v-icon icon="mdi-check-circle" size="large" class="mb-1" />
            <div class="text-subtitle-1 font-weight-bold">Tiquet Detectat!</div>
            <div class="text-caption">
              ID Tiquet: {{ scannedData.couponId }} | ID Stock:
              {{ scannedData.stockId }} | Quantitat: {{ scannedData.amount }} | ID Item: {{scannedData.itemId}}
            </div>
          </v-card>
        </v-col>

        <v-card-actions class="mt-4">
          <v-spacer />
          <v-btn
            @click="submitForm"
            icon="mdi-content-save"
            color="success"
            :disabled="!valid || !scannedData || loading"
            :loading="loading"
          />
          <v-btn @click="closeComponent" icon="mdi-cancel" />
        </v-card-actions>
      </v-card>
    </v-form>
  </v-container>

  <ErrorDialog
    @closed="showErrorDiag = false"
    :message="error"
    v-model="showErrorDiag"
  />
</template>

<script setup>
import ErrorDialog from "@/components/ErrorDialog.vue";
import { useAuthStore } from "@/stores/auth";
import { ref, computed, onBeforeUnmount } from "vue";
import { Html5Qrcode } from "html5-qrcode";
import { paymentTypes } from "@/stores/backendEnums";

const auth = useAuthStore();

const displayedStores = computed(() => {
  const itemId = scannedData.value?.itemId;

  if (!itemId) {
    return [];
  }

  return auth.fallaAdminInfo.stores.filter(s => {
    return s.stocks.some(stock => {
      return stock.itemId === scannedData.value.itemId;
    });
  });
});
const valid = ref(false);
const form = ref(null);
const loading = ref(false);
const emit = defineEmits(["closed"]);

const error = ref("");
const showErrorDiag = ref(false);

// Nuevos estados para el flujo del QR
const selectedStore = ref(null);
const scanning = ref(false);
const scannedData = ref(null); // Aquí guardaremos el JSON temporal parseado del QR
let html5QrcodeScanner = null;

// Computado para detectar si es un dispositivo móvil básico
const isMobile = computed(() => {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );
});

// Control del encendido/apagado del escáner
const toggleScanner = async () => {
  if (scanning.value) {
    await stopScanner();
  } else {
    startScanner();
  }
};

const startScanner = () => {
  scanning.value = true;
  scannedData.value = null;

  // Pequeño timeout para asegurar que Vuetify monte el div id="qr-reader"
  setTimeout(() => {
    html5QrcodeScanner = new Html5Qrcode("qr-reader");
    html5QrcodeScanner
      .start(
        { facingMode: "environment" }, // Usa la cámara trasera por defecto
        {
          fps: 10, // Velocidad de escaneo (10 frames por segundo)
          qrbox: { width: 220, height: 220 }, // Recuadro visual guía
        },
        (decodedText) => {
          // Éxito: Se leyó un QR
          processQrCode(decodedText);
        },
        () => {
          // Error de escaneo continuo silencioso (fallas de enfoque por frame)
        }
      )
      .catch((err) => {
        error.value = "Error en accedir a la càmera: " + err;
        showErrorDiag.value = true;
        scanning.value = false;
      });
  }, 100);
};

const stopScanner = async () => {
  if (html5QrcodeScanner && html5QrcodeScanner.isScanning) {
    await html5QrcodeScanner.stop();
  }
  scanning.value = false;
};

// Procesar el texto extraído del código QR
const processQrCode = async (text) => {
  try {
    // Ejemplo esperado: app://exchange?couponId=5&stockId=12&amount=2
    if (!text.startsWith("app://exchange")) {
      throw new Error(
        "El codi QR escanejat no és un tiquet vàlid d'aquesta aplicació."
      );
    }

    const urlParams = new URLSearchParams(text.split("?")[1]);

    scannedData.value = {
      couponId: parseInt(urlParams.get("couponId")),
      stockId: parseInt(urlParams.get("stockId")),
      amount: parseInt(urlParams.get("amount")) || 1,
      itemId: parseInt(urlParams.get("itemId")),
      fallaId: parseInt(urlParams.get("fallaId"))
    };
    if(scannedData.value.fallaId !== auth.fallaAdminInfo.fallaId) {
      await stopScanner()
      scannedData.value = null
      error.value="El tiquet no es de la falla"
      showErrorDiag.value = true
    } else {
      await stopScanner();

    }
      
  } catch (err) {
    await stopScanner();
    error.value = err.message || "Error al processar el codi QR";
    showErrorDiag.value = true;
  }
};

const submitForm = async () => {
  try {
    const { valid: formValid } = await form.value.validate();
    if (!formValid || !scannedData.value) return;

    loading.value = true;

    // Construcción exacta del CouponExchangeRequestDTO que requiere tu backend
    const request = {
      coupon: {
        couponId: scannedData.value.couponId,
        amount: scannedData.value.amount,
      },
      stockId: scannedData.value.stockId,
      storeId: selectedStore.value, // El almacén de retorno elegido en el selector
      type: paymentTypes[1].value,
      message: null,
    };

    // Llamada a tu endpoint @PostMapping("/exchangeCoupon")
    await auth.exchangeCoupon(request);

    closeComponent();
  } catch (err) {
    error.value = err;
    showErrorDiag.value = true;
  } finally {
    loading.value = false;
  }
};

const closeComponent = async () => {
  await stopScanner();
  emit("closed");
};

// Asegurar apagar la cámara si destruyen el componente inesperadamente
onBeforeUnmount(async () => {
  await stopScanner();
});

function storeProps(item) {
  return {
    title: item.name,
    subtitle: item.location,
    value: item.id,
  };
}
</script>
