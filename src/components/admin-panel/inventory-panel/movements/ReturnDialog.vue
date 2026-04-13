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
                <v-divier/>
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
                    <v-btn class="bg-ternary" variant="submit" icon="mdi-plus" @click="submitForm"></v-btn>
                </v-card-actions>
            </v-card>
        </v-form>
    </v-container>
    <ErrorDialog :message="error" v-model="showErrorDiag" @closed="showErrorDiag=false"/>
</template>

<script setup>
import { useAuthStore } from '@/stores/auth';
import { ref, computed, defineProps, defineEmits } from 'vue';


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
        await auth.returnLoan(returnDto)
        emit('closed')
    } catch(err) {
        error.value = err
        showErrorDiag.value = true
    }
}

</script>