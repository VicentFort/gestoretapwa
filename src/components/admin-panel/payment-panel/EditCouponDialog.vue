<template>
    <v-container>
        <v-form @submit.prevent="submitForm" ref="form" v-model="valid">
            <v-card class="bg-primary">
                <v-card-title class="text-primary font-weight-bold bg-ternary">
                    Editant el tiquet: {{ localCoupon.name }}
                    Id: {{ localCoupon.id }}
                </v-card-title>
                <v-col>
                    <v-row rows="12" md="6">
                        <v-text-field v-model="localCoupon.name" label="Nom del tiquet"/>
                    </v-row>
                </v-col>
                <v-col>
                    <v-row rows="12" md="6">
                        <v-text-field label="Preu del tiquet" v-model="localCoupon.price" type="input"/>
                    </v-row>
                </v-col>
                <v-col>
                    <v-row rows="12" md="6">
                        <v-select :items="items" label="Item" v-model="localCoupon.itemId" :item-props="itemProps"/>
                    </v-row>
                </v-col>
                <v-card-actions>
                    <v-btn @click="emits('closed')" icon="mdi-cancel" color="ternary" variant="text"/>
                    <v-btn @click="submitForm" icon="mdi-plus" color="ternary" variant="text"/>
                </v-card-actions>
            </v-card>
        </v-form>
    </v-container>
    <ErrorDialog @closed="showErrorDiag=false", :message="error" v-model="showErrorDiag"/>
</template>

<script setup>
import { useAuthStore } from '@/stores/auth';
import ErrorDialog from '@/components/ErrorDialog.vue';
import { ref } from 'vue';


const auth = useAuthStore()
const items = ref(auth.fallaAdminInfo?.inventoryItems)
const props = defineProps({
    modelView : Boolean,
    coupon: Object
})
const localCoupon = ref({...props.coupon})
const emits = defineEmits(['closed'])

const valid = ref(false)
const form = ref(null)
const error = ref('')
const showErrorDiag = ref(false)

function itemProps (item) {
    return {
        title: item.name,
        value: item.id
    }
}

const submitForm = async () => {
     try {
        const {valid: formValid} = await form.value.validate();
        if(!formValid) return 
        const couponReq = {
            couponId: localCoupon.value.id,
            name: localCoupon.value.name,
            price: localCoupon.value.price,
            itemId: localCoupon.value.itemId
        }
        console.log(couponReq)
        await auth.editCoupon(couponReq)
        emits('closed')
     } catch(err) {
        error.value=err
        showErrorDiag.value = true
     }
}
</script>