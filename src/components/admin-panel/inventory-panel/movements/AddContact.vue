<template>
    <v-containner>
        <v-form @subimt.prevent="submitForm" ref="form" v-model="valud">
            <v-card>
                <v-card-title class="text-h6 font-weight-bold">
                    Registrar contacte
                </v-card-title>
                <v-row>
                    <v-col cols="12" md="6">
                        <v-text-field
                        label="Nom del contacte"
                        v-model="name"
                        >
                        </v-text-field>
                    </v-col>
                    <v-col cols="12" md="6">
                        <v-text-field
                        label="Correu electrònic"
                        v-model="email"/>
                    </v-col>
                    <v-col cols="12" md="6">
                        <v-text-field
                        label="Telèfon"
                        v-model="phone"/>
                    </v-col>
                    <v-col cols="12" md="6">
                        <v-text-field
                        label="DNI / CIF"
                        v-model="dniCif"/>
                    </v-col>
                </v-row>
                <v-card-actions>
                    <v-spacer/>
                    <v-btn variant="submit" class="" icon="mdi-content-save" @click="submitForm" :disabled="name=='' || phone=='' || email=='' || dniCif==''"/>
                    <v-btn class="" icon="mdi-cancel" @click="emit('closed')"/>

                </v-card-actions>
            </v-card>
        </v-form>
    </v-containner>
    <ErrorDialog :message="error" v-model="showErrorDiag" @closed="showErrorDiag=false"/>
</template>

<script setup>
import ErrorDialog from '@/components/ErrorDialog.vue';
import { useAuthStore } from '@/stores/auth';
import { ref } from 'vue';


const auth = useAuthStore()
const form = ref(null)
const valid = ref(false)

const name = ref('')
const email = ref('')
const phone = ref('')
const dniCif = ref('')

const error = ref('')
const showErrorDiag = ref(false)

const emit = defineEmits(['closed'])

const submitForm = async () => {
    try {
        const {valid:formValid} = await form.value.validate()
        if(!formValid) return
        const contact = {
            name: name.value,
            email: email.value,
            phone: phone.value,
            dniCif: dniCif.value
        }
        await auth.createContact(contact);
        emit('closed')
    } catch(err) {
        error.value=err
        showErrorDiag.value= true
    }
}

</script>