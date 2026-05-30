<template>
    <v-container>
        <v-card>
            <v-data-table-virtual
                :items="displayedCouponStocks"
                no-data-text="No tens tiquets per bescanviar"
                :headers="headers"
            >
                <template #item.qrCode="{ item }">
                    <div class="text-center">
                        <v-btn 
                            icon="mdi-qrcode" 
                            variant="elevated" 
                            color="primary"
                            size="small"
                            @click="openConfigModal(item)"
                        />
                    </div>
                </template>
            </v-data-table-virtual>

            <v-card-actions>
                <v-spacer/>
                <v-btn @click="emit('closed')" icon="mdi-cancel" />
            </v-card-actions>
        </v-card>

        <v-dialog v-model="modal.show" max-width="400" persistent>
            <v-card class="text-center pa-4">
                <v-card-title class="text-h5 font-weight-bold">
                    {{ modal.title }}
                </v-card-title>
                
                <v-card-text class="py-4">
                    <div v-if="!modal.qrImage">
                        <p class="mb-4 text-body-1">Selecciona la quantitat a bescanviar:</p>
                        
                        <v-select
                            v-model="modal.selectedAmount"
                            :items="modal.amountOptions"
                            label="Quantitat"
                            variant="outlined"
                            density="comfortable"
                        ></v-select>

                        <v-btn 
                            color="primary" 
                            block 
                            class="mt-2"
                            :loading="modal.loading"
                            @click="generateQrCode"
                        >
                            Generar Codi QR
                        </v-btn>
                    </div>

                    <div v-else :key="modal.qrImage" class="flex-column align-center d-flex">
                        <img 
                            :src="modal.qrImage" 
                            alt="Codi QR ampliat"
                            max-width="280"
                            aspect-ratio="1"
                            class="mb-4 rounded-lg elevation-3"
                        />
                        <v-chip color="secondary" variant="flat" class="mb-2">
                            Quantitat a bescanviar: {{ modal.selectedAmount }}
                        </v-chip>
                        <p>
                            Presenta aquest codi a la falla
                        </p>
                    </div>
                </v-card-text>

                <v-card-actions>
                    <v-btn 
                        v-if="modal.qrImage" 
                        variant="text" 
                        color="grey"
                        @click="modal.qrImage = null"
                    >
                        Modificar quantitat
                    </v-btn>
                    <v-spacer />
                    <v-btn 
                        color="error" 
                        variant="tonal" 
                        @click="modal.show = false"
                    >
                        Tancar
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-container>
    <ErrorDialog :message="error" @closed="showErrorDiag=false" v-model="showErrorDiag"/>
</template>

<script setup>
import { useAuthStore } from '@/stores/auth';
import { computed, nextTick, reactive, ref } from 'vue';
import ErrorDialog from '@/components/ErrorDialog.vue';
// Importa tu cliente de API/Axios aquí si es necesario
// import axios from 'axios';

const auth = useAuthStore()
const emit = defineEmits(['closed'])

const error = ref('')
const showErrorDiag = ref(false)

const displayedCouponStocks = computed(() => {
    return auth.userInfo.couponStocks.filter(s => s.amount > 0)
})

// Estado del modal unificado
const modal = reactive({
    show: false,
    title: '',
    loading: false,
    selectedAmount: 1,
    amountOptions: [],
    qrImage: null,
    // Guardamos la referencia del tiquet seleccionado para cuando hagamos la petición
    selectedItem: null 
})

// 1. Abre el modal y calcula el rango dinámico del selector (de 1 al máximo disponible)
const openConfigModal = (item) => {
    modal.selectedItem = item;
    modal.title = item.coupon?.nombre || 'Bescanviar Tiquet';
    modal.selectedAmount = 1; // Reseteamos a 1 por defecto
    modal.qrImage = null; // Limpiamos QR anterior
    
    // Generar array numérico desde 1 hasta item.amount (ej: si hay 5, genera [1, 2, 3, 4, 5])
    modal.amountOptions = Array.from({ length: item.amount }, (_, i) => i + 1);
    
    modal.show = true;
}

// 2. Llama al backend enviando la cantidad seleccionada para obtener el QR final
const generateQrCode = async () => {
    modal.loading = true;
    try {
        // CORRECCIÓN AQUÍ: Acceder correctamente a la propiedad según tu entidad
        // Si en tu backend 'CouponStock' tiene 'coupon' y este tiene 'couponId':
        const couponId = modal.selectedItem.couponId
        const stockId = modal.selectedItem.id
        const amount = modal.selectedAmount;

        if (!couponId || !stockId) {
            throw new Error("No s'han pogut recuperar els identificadors del tiquet.");
        }

        const qrResponse = await auth.generateQrCode(couponId, stockId, amount);
        
        // Asignamos el String Base64 directo al estado reactivo
        await nextTick()
        modal.qrImage = qrResponse
        
    } catch (err) {
        error.value = err.message || err;
        showErrorDiag.value = true;
    } finally {
        modal.loading = false;
    }
}

const headers = [
    {
        title: "Tiquet",
        align: "center",
        key: "coupon",
        sortable: true,
        headerProps: { class: "font-weight-bold bg-secondary" }
    },
    {
        title: "Disponibles",
        align: "center",
        key: "amount",
        sortable: true,
        headerProps: { class: "font-weight-bold bg-secondary" }
    },
    {
        title: "Acció",
        align: "center",
        key: "qrCode",
        sortable: false,
        headerProps: { class: "font-weight-bold bg-secondary" }
    }
]
</script>