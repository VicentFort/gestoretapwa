<template>
    <v-container>
        <v-form v-model="valid" ref="form" @submit.prevent="submitForm">
            <v-card>
                <v-card-text class="bg-secondary">
                    Vols unir-te a la falla: {{ falla.name }}
                </v-card-text>
                <v-row>
                    <v-col cols="12" md="6">
                        <v-textarea
                        label="Missatge per a la falla"
                        v-model="message"
                        :rules="[a => a !== '']"
                        />
                    </v-col>
                </v-row>
                <v-card-actions>
                    <v-spacer/>
                    <v-btn type="submit" icon="mdi-content-save"  :disabled="!valid"/>
                    <v-btn @click="emit('closed')" icon="mdi-cancel"/>
                </v-card-actions>
            </v-card>
        </v-form>
    </v-container>
    <ErrorDialog :message="error" v-model="showErrorDiag" @closed="showErrorDiag=false"/>
</template>

<script setup>
import { useAuthStore } from '@/stores/auth';
import { ref } from 'vue';
import ErrorDialog from '../ErrorDialog.vue';

const auth = useAuthStore()

const props = defineProps({
    falla: Object
})
const emit = defineEmits(['closed'])

const valid = ref(false)
const form = ref(null)

const error = ref('')
const showErrorDiag = ref(false)

const message = ref('')


const submitForm = async () => {
    try {
        const {valid: formValid} = await form.value.validate()
        if(!formValid) return

        const req = {
            idUser: auth.userInfo.id,
            idFalla: props.falla.id,
            message: message.value
        }
        await auth.sendRequest(req)
        emit('closed')
    } catch (err) {
        error.value = err
        showErrorDiag.value = true
    }
}

</script>