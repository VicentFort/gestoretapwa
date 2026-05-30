<template>
    <v-container>
        <v-form @submit.prevent="submitForm" ref="form" v-model="valid">
            <v-card>
                <v-card-title class="font-weight-bold">
                Bescanvi de tiquet
                </v-card-title>
            <v-col>
                <v-row rows="12" md="6">
                    <v-select v-if="auth.fallaAdminInfo.coupons" :items="coupons" :item-props="couponProps" v-model="coupon" label="Tiquet a bescanviar"/>
                </v-row>
            </v-col>
            <v-col>
                <v-row rows="12" md="6">
                    <v-select v-if="auth.fallaAdminInfo.stores" :items="stores" :item-props="storeProps" v-model="selectedStore" label="Magatzem d'origen"/>
                </v-row>
            </v-col>
            <v-col>
                <v-row rows="12" md="6">
                    <v-number-input label="Quantitat de tiquets a bescanviar" v-model="couponAmount" :min="1" :step="1" :max="getMaxStock"/>
                </v-row>
            </v-col>
            <v-col>
                <v-row rows="12" md="6">
                    <v-text-field label="Correu de l'usuari" v-model="userEmail"/>
                </v-row>
            </v-col>
            <v-card-actions>
                <v-spacer/>
                <v-btn @click="submitForm" icon="mdi-content-save"  :disabled="!coupon || !userEmail"/>
                <v-btn @click="emit('closed')" icon="mdi-cancel" />
            </v-card-actions>  
            </v-card>
        </v-form>

    </v-container>
    <ErrorDialog @closed="showErrorDiag=false" :message="error" v-model="showErrorDiag"/>

</template>

<script setup>
import ErrorDialog from '@/components/ErrorDialog.vue';
import { useAuthStore } from '@/stores/auth';
import { paymentTypes } from '@/stores/backendEnums';
import { computed, ref } from 'vue';


const auth = useAuthStore()
const coupons = ref(auth.fallaAdminInfo?.coupons)
const stores = ref(auth.fallaAdminInfo.stores)

const valid = ref(false)
const form = ref(null)

const emit = defineEmits(['closed'])


const error = ref('')
const showErrorDiag = ref(false)

const selectedType = ref(paymentTypes[1])
const selectedStore = ref(null)
const userEmail = ref('')
const coupon = ref(null)
const couponAmount = ref(1)

const submitForm = async () => {
    try {
        const {valid: formValid} = await form.value.validate();
        if(!formValid) return 
        const request = {
            type : selectedType.value.value,
            userEmail: userEmail.value,
            coupons : [
               {
                couponId: coupon.value.id,
                amount: couponAmount.value
               } 
            ],
            storeId: selectedStore.value,
        }
        console.log(request)
        await auth.exchangeCoupon(request)
        auth.fetchFallaAdminInfo()
        emit('closed')
    } catch(err) {
        error.value = err
        showErrorDiag.value = true
    }
}

const getMaxStock = computed(() => {
    if (!coupon.value) return 1;
    return Number(coupon.value.totalAmount) || 1
})



function couponProps (item) {
    const formattedSubtitle = "Preu: " + item.price + "€"
    return {
        title: item.name,
        subtitle: formattedSubtitle,
        value: item
    }
}

function storeProps (item) {
    return {
        title: item.name,
        subtitile: item.location,
        value: item.id
    }
}
</script>