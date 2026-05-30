<template>
    <v-container>
        <v-form @submit.prevent="submitForm" ref="form" v-model="valid">
            <v-card>
                <v-card-title class="font-weight-bold">
                    Editant el contacte de {{ contact.name }}
                </v-card-title>
                <v-row>
                    <v-col cols="12" md="6">
                        <v-text-field
                        label="Nom"
                        v-model="localContact.name"
                        type="text"
                        >
                        </v-text-field>
                    </v-col>
                    <v-col cols="12" md="6">
                        <v-text-field
                        label="Correu electrònic"
                        v-model="localContact.email"
                        type="text">
                        </v-text-field>
                    </v-col>
                    <v-col cols="12" md="6">
                        <v-text-field
                        label="Telèfon"
                        v-model="localContact.phone"
                        type="text">
                        </v-text-field>
                    </v-col>
                    <v-col cols="12" md="6">
                        <v-text-field
                        label="DNI / CIF"
                        v-model="localContact.dniCif"
                        type="text">
                        </v-text-field>
                    </v-col>
                    <v-card-actions>
                        <v-spacer/>
                        <v-btn type="submit" class="" icon="mdi-content-save-edit"/>
                        <v-btn class="" @click="emit('closed')" icon="mdi-cancel"/>
                    </v-card-actions>
                </v-row>
            </v-card>
        </v-form>
    </v-container>
    <ErrorDialog :message="error" v-model="showErrorDiag" @closed="showErrorDiag=false"/>
</template>

<script setup>
import ErrorDialog from '@/components/ErrorDialog.vue';
import { useAuthStore } from '@/stores/auth';
import { ref, watch } from 'vue';


const auth = useAuthStore()

const form = ref(null)
const valid = ref(false)

const error = ref('')
const showErrorDiag = ref(false)

const props = defineProps({
    modelView:Boolean,
    contact: Object
})

const localContact = ref({...props.contact})
watch(() => props.contact, (newVal)=> {
    localContact.value = {...newVal}
}, {deep:true})

const emit = defineEmits(['closed'])

const submitForm = async () => {
    try {
        const {valid: formValid} = await form.value.validate()
        if(!formValid) return;

        const contact = {
            id: props.contact.id,
            name: localContact.value.name,
            email: localContact.value.email,
            phone: localContact.value.phone,
            dniCif: localContact.value.dniCif
        }
        await auth.updateContact(contact)
        emit('closed')
    } catch(err) {
        error.value = err,
        showErrorDiag.value = true
    }
}

</script>