<template>
  <v-container>
    <v-form @submit.prevent="submitForm" ref="form" v-model="valid">
      <v-card>
        <v-card-title class="font-weight-bold"> Vendre tiquet </v-card-title>
        <v-col>
          <v-row rows="12" md="6">
            <v-select
              v-if="auth.fallaAdminInfo.coupons"
              :items="coupons"
              :item-props="couponProps"
              v-model="coupon"
              label="Tiquet a vendre"
            />
          </v-row>
        </v-col>
        <v-col>
          <v-row rows="12" md="6">
            <v-number-input
              label="Quantitat de tiquets a vendre"
              v-model="couponAmount"
              :min="1"
              :step="1"
              :max="getMaxStock"
            />
          </v-row>
        </v-col>
        <v-col>
          <v-row rows="12" md="6">
            <v-text-field label="Correu de l'usuari" v-model="userEmail" />
          </v-row>
        </v-col>
        <v-card-actions>
          <v-spacer />
          <v-btn
            @click="submitForm"
            icon="mdi-content-save"
            :disabled="!coupon || !userEmail"
          />
          <v-btn @click="emit('closed')" icon="mdi-cancel" />
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
import { paymentTypes } from "@/stores/backendEnums";
import { computed, ref } from "vue";
import { useDisplay } from "vuetify/lib/composables/display";

const auth = useAuthStore();
const coupons = ref(auth.fallaAdminInfo?.coupons);

const valid = ref(false);
const form = ref(null);

const emit = defineEmits(["closed"]);

const { xs } = useDisplay();

const error = ref("");
const showErrorDiag = ref(false);

const selectedType = ref(paymentTypes[0]);
const userEmail = ref("");
const coupon = ref(null);
const couponAmount = ref(1);

const submitForm = async () => {
  try {
    const { valid: formValid } = await form.value.validate();
    if (!formValid) return;
    const request = {
      type: selectedType.value.value,
      userEmail: userEmail.value,
      coupons: [
        {
          couponId: coupon.value.id,
          amount: couponAmount.value,
        },
      ],
      totalPrice: coupon.value.price * couponAmount.value,
    };
    await auth.sellCoupon(request);
    auth.fetchFallaAdminInfo();
    emit("closed");
  } catch (err) {
    error.value = err;
    showErrorDiag.value = true;
  }
};

const getMaxStock = computed(() => {
  if (!coupon.value) return 1;
  return Number(coupon.value.totalAmount) || 1;
});

function couponProps(item) {
  const formattedSubtitle = "Preu: " + item.price + "€";
  return {
    title: item.name,
    subtitle: formattedSubtitle,
    value: item,
  };
}
</script>
