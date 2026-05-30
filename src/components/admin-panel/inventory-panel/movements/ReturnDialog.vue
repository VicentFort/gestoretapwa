<template>
    <v-container>
        <v-form @subimt.prevent="handleLogin" ref="form" v-model="valid">
            <v-card>
                <v-card-title class="font-weight-bold">
                    Registrar la tornada del préstec amb id: {{ loan.id }}
                </v-card-title>
                <v-divider/>
                <v-card-text class="">
                    Item: {{ loan.itemName }}
                </v-card-text>
                <v-card-text class="">
                    Contacte: {{ loan.contactName }}
                </v-card-text>
                <v-card-text class="">
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
                    <v-spacer/>
                    <v-btn class="" variant="submit" icon="mdi-content-save" @click="submitForm" :disabled="selectedStore==null || message==null"/>
                    <v-btn class="" @click="emit('closed')" icon="mdi-cancel"/>

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



        emit('closed')
    } catch(err) {
        console.error(err)
        error.value = err
        showErrorDiag.value = true
    }
}

const formattedDate = (dateString) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleString('es-ES') // Simplificado para el ejemplo
}
</script>