<template>
    <v-container>
        <v-form @submit.prevent="submitForm" ref="form" v-model="valid">
            <v-card>
                <v-card-title class="font-weight-bold">
                Modificar sol·licitud
                </v-card-title>
                <v-row>
                    <v-col cols="12" md="6">
                        <v-checkbox 
                        label="Aprovar?" 
                        v-model="aproved"
                        :rules="[a => a !== null]"
                        />
                    </v-col>
                    <v-col cols="12" md="6">
                        <v-textarea label="Resolució" v-model="reply"
                        :rules="[r => r !== null && r !== '']"/>
                    </v-col>
                </v-row>
                <v-card-actions>
                    <v-spacer/>
                    <v-btn type="submit" icon="mdi-plus" :disabled="!valid"/>
                    <v-btn icon="mdi-cancel" @click="emit('closed')"/>
                </v-card-actions>
            </v-card>
        </v-form>
    </v-container>
    <ErrorDialog :message="error" v-model="showErrorDiag" @closed="showErrorDiag= false"/>
</template>

<script setup>
import ErrorDialog from '@/components/ErrorDialog.vue';
import { useAuthStore } from '@/stores/auth';
import { ref } from 'vue';


const props = defineProps({
    modelValue: Boolean,
    request: Object
})

const auth = useAuthStore()
const form = ref(null)
const valid = ref(false)

const emit = defineEmits(['closed'])

const error = ref('')
const showErrorDiag = ref(false)

const reply = ref('')
const aproved = ref(true)

const submitForm = async () => {
    try {
        const { valid: formValid } = await form.value.validate();
        if (!formValid) return;
        const req = {
            requestId: props.request.requestId,
            idFalla: props.request.fallaId,
            idUser: props.request.userId,
            aproved: aproved.value,
            reply: reply.value
        }
        await auth.updateRequest(req)
        emit('closed')
    } catch(err) {
        error.value =err
        showErrorDiag.value = true
    }
}

</script>