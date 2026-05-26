<template>
    <v-container>
        <v-form @submit.prevent="submitForm" ref="form" v-model="valid">
            <v-card class="bg-primary">
                <v-card-title class="text-primary font-weight-bold bg-ternary">
                Registrar un pagament
            </v-card-title>
            <v-col>
                <v-row rows="12" md="6">
                    <v-select :items="otherPaymentTypes" :item-props="paymentProps" label="Tipus de pagament" v-model="selectedType"/>
                </v-row>
            </v-col>
            <v-col>
                <v-row rows = "12" md="6">
                    <v-text-field label="Missatge" v-model="message"/>
                </v-row>
            </v-col>
            <v-col v-if="selectedType!= null && (selectedType.id == 1 || selectedType.id == 2)">
                <v-row rows="12" md="6">
                    <v-select v-if="auth.fallaAdminInfo.coupons" :items="coupons" :item-props="couponProps" v-model="coupon" :label="formattedCouponLabel"/>
                </v-row>
            </v-col>
            <v-col v-if="selectedType!= null && (selectedType.id == 1 ||selectedType.id == 2)">
                <v-row rows="12" md="6">
                    <v-number-input :label="formattedAmountLabel" v-model="couponAmount" :min="1" :step="1" :max="getMaxStock"/>
                </v-row>
            </v-col>
            <v-col v-if="selectedType!= null && (selectedType.id == 1 ||selectedType.id == 2)">
                <v-row rows="12" md="6">
                    <v-text-field label="Correu de l'usuari" v-model="userEmail"/>
                </v-row>
            </v-col> 
            <v-col v-if="selectedType!= null && selectedType.id == 2">
                <v-row rows="12" md="6">
                    <v-select v-if="auth.fallaAdminInfo.stores" :items="stores" :item-props="storeProps" v-model="selectedStore" label="Magatzem d'origen"/>
                </v-row>
            </v-col>  
            <v-col v-if="selectedType && selectedType.id == 3">
                <v-row rows="12" md="6">
                    <v-select v-if="auth.fallaAdminInfo.users" :items="users" :item-props="userProps" v-model="feeUser" label="Usuari a cobrar quota"/>
                </v-row>
            </v-col>
            <v-col v-if="selectedType && selectedType.id == 3">
                <v-row rows="12" md="6">
                    <v-number-input label="Quota (€)" :min="5.00" :step="5.00" v-model="feeAmount"/>
                </v-row>
            </v-col>
            <v-card-actions>
                <v-btn @click="emit('closed')" icon="mdi-cancel" color="ternary"/>
                <v-btn @click="submitForm" icon="mdi-plus" color="ternary" :disabled="!checkFields"/>
            </v-card-actions>  
            </v-card>
        </v-form>

    </v-container>
    <ErrorDialog @closed="showErrorDiag=false" :message="error" v-model="showErrorDiag"/>

</template>

<script setup>
import ErrorDialog from '@/components/ErrorDialog.vue';
import { useAuthStore } from '@/stores/auth';
import { otherPaymentTypes } from '@/stores/backendEnums';
import { computed, ref } from 'vue';


const auth = useAuthStore()
const coupons = ref(auth.fallaAdminInfo?.coupons)
const stores = ref(auth.fallaAdminInfo?.stores)
const users = ref(auth.fallaAdminInfo?.users)


const valid = ref(false)
const form = ref(null)

const emit = defineEmits(['closed'])


const error = ref('')
const showErrorDiag = ref(false)

const selectedType = ref(null)
const message = ref('')
const userEmail = ref('')
const coupon = ref(null)
const couponAmount = ref(1)
const selectedStore = ref(null)

const feeUser = ref(null)
const feeAmount = ref(5)

const submitForm = async () => {
    try {
        const {valid: formValid} = await form.value.validate();
        if(!formValid) return 
        const request = generateRequest()
        switch(selectedType.value.id) {
            case 1:
                await auth.sellCoupon(request)
                break;
            case 2:
                await auth.exchangeCoupon(request);
                break;
            case 3:
                await auth.feePayment(request);
                break;
        }
        await auth.fetchFallaAdminInfo()
        emit('closed')
    } catch(err) {
        error.value = err
        showErrorDiag.value = true
    }
}

const formattedCouponLabel = computed(() => {
    if(selectedType.value.id == 1) return 'Tiquet a vendre'
    if(selectedType.value.id == 2) return 'Tiquet a bescanviar'
})
const formattedAmountLabel = computed(() => {
    if(selectedType.value.id == 1) return 'Quantitat de tiquets a vendre'
    if(selectedType.value.id == 2) return 'Quantitat de tiquets a bescanviar'
})

const checkFields = computed(() => {
    if(!selectedType.value) return false
    switch(selectedType.value.id) {
        case 1:
            if(!coupon.value) return false
            if(!couponAmount.value) return false
            if(!userEmail.value) return false
            return true
        case 2: 
            if(!coupon.value) return false
            if(!couponAmount.value) return false
            if(!userEmail.value) return false
            if(!selectedStore.value) return false
            return true
        case 3:
            if(!feeUser.value) return false
            if(!feeAmount.value) return false
            return true
        default: return true
    }
})

const getMaxStock = computed(() => {
    if (!selectedType.value) return 1;

    if (!coupon.value) return 1;
    return Number(coupon.value.totalAmount) || 1
})


function generateRequest () {
    if(selectedType.value == null) return
    if(selectedType.value.id < 1) return
    let request = {
                type : selectedType.value.value,
                message : message.value
            }
    switch (selectedType.value.id) {
        case 1:
            request.coupons = [
               {
                couponId: coupon.value.id,
                amount: couponAmount.value
               } 
            ]
            const totalPrice = coupon.value.price * couponAmount.value
            request.totalPrice = totalPrice
            request.userEmail = userEmail.value
            break
        case 2:
            request.coupons = [
               {
                couponId: coupon.value.id,
                amount: couponAmount.value
               } 
            ]
            request.userEmail = userEmail.value
            request.storeId = selectedStore.value
            
            break
        case 3:
            request.userId = feeUser.value.id
            request.feeAmount = feeAmount.value
    }
    return request;
}

function paymentProps (item) {
    return {
        title: item.name,
        value: item
    }
}

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

function userProps (item) {
    return {
        title: item.name + " " + item.surname,
        value: item
    }
}
</script>