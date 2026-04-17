<template>
    <v-container>
        <v-form @subimt.prevent="handleLogin" ref="form" v-model="valid">
            <v-card class="bg-primary">
                <v-card-title class="text-primary font-weight-bold bg-ternary">
                    Registrar la tornada del préstec amb id: {{ loan.id }}
                </v-card-title>
                <v-divider/>
                <v-card-text class="bg-primary">
                    Item: {{ loan.itemName }}
                </v-card-text>
                <v-card-text class="bg-primary">
                    Contacte: {{ loan.contactName }}
                </v-card-text>
                <v-card-text class="bg-primary">
                    Quantitat: {{ loan.amount }}
                </v-card-text>
                <v-divider/>
                <v-row>
                    <v-col cols="12" md="6">
                        <v-select
                        label="Magatzem de retorn"
                        v-model="selectedStore"
                        :items="availableStores"
                        item-title="name"
                        item-value="id"
                        />
                    </v-col>
                    <v-col cols="12" md="6">
                        <v-text-field
                        label="Missatge"
                        v-model="message"
                        />
                    </v-col>
                </v-row>
                <v-card-actions>
                    <v-btn class="bg-ternary" @click="emit('closed')" icon="mdi-cancel"></v-btn>
                    <v-btn class="bg-ternary" variant="submit" icon="mdi-plus" @click="submitForm" :disabled="selectedStore==null || message==null"></v-btn>
                </v-card-actions>
            </v-card>
        </v-form>
    </v-container>
    <ErrorDialog :message="error" v-model="showErrorDiag" @closed="showErrorDiag=false"/>
</template>

<script setup>
import { useAuthStore } from '@/stores/auth';
import ErrorDialog from '@/components/ErrorDialog.vue';
import { ref, computed, defineProps, defineEmits } from 'vue';
import emailjs from '@emailjs/browser';


const auth = useAuthStore()

const error = ref('')
const showErrorDiag = ref(false)

const form = ref(null)
const valid = ref(false)
const message = ref('')
const selectedStore = ref(null)

const availableStores = computed(() => auth.fallaAdminInfo?.stores.filter(store => {
    return store.enabled==true
}) || []) 

const props = defineProps({
    modelView: Boolean,
    loan: Object
})

const emit = defineEmits(['closed'])

const submitForm = async () => {
    try {
        const {valid: formValid} = await form.value.validate()
        if(!formValid) return
        const returnDto = {
            loanId:props.loan.id,
            storeId: selectedStore.value,
            amount:props.loan.amount,
            message: message.value
        }
        const response = await auth.returnLoan(returnDto)
        const loanInfo = response?.data

        console.log("LOAN INFO: ")
        console.log(loanInfo)

        const serviceId = process.env.VUE_APP_EMAIL_JS_SERVICE_ID
        const templateId = process.env.VUE_APP_EMAIL_JS_TEMPLATE_RETURN_LOAN_ID
        const key = process.env.VUE_APP_EMAIL_JS_KEY


        const formData = {
            loanId: loanInfo.id,
            contactName: loanInfo.contactName,
            contactEmail: loanInfo.contactEmail,
            amount: loanInfo.amount,
            itemName: loanInfo.itemName,
            fallaName: auth.fallaAdminInfo?.name,
            returnDate: loanInfo.realReturnDate
        }
        console.log("FORM DATA: ")
        console.log(formData)

        const emailResponse = await emailjs.send(
            serviceId,
            templateId,
            formData,
            key
        )
        
        console.log("EMAIL RESPONSE: " + emailResponse)

        emit('closed')
    } catch(err) {
        console.error(err)
        error.value = err
        showErrorDiag.value = true
    }
}

</script>