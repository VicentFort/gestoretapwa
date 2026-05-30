<template>
    <v-container>
        <v-form @submit.prevent="submitForm" ref="form" v-model="valid">
            <v-card>
                <v-card-title class="font-weight-bold">
                    Crear un nou magatzem
                </v-card-title>
                <v-col>
                    <v-row rows="12" md="6">
                        <v-text-field
                            v-model="name",
                            label="Nom del magatzem"
                            type="text"
                            required
                        ></v-text-field>
                    </v-row>
                    <v-row rows="12" md="6">
                        <v-text-field
                            v-model="location",
                            label="Ubicació del magatzem"
                            type="text"
                            required
                        ></v-text-field>
                    </v-row>
                </v-col>
                <v-card-actions>
                    <v-spacer/>
                    <v-btn type="submit" class="" :disabled="name=='' || location==''" icon="mdi-content-save"/>
                    <v-btn class="align-left" icon="mdi-cancel" @click="emit('closed')"/>

                </v-card-actions>
            </v-card>
        </v-form>
        <v-dialog v-model="showErrorDiag" width="400px">
            <v-card>
                <v-card-title class="text-white bg-error">Error</v-card-title>
                <v-card-text>{{ error }}</v-card-text>
                <v-card-actions>
                    <v-btn type="error", variant="text" @click="showErrorDiag=false" icon="mdi-cancel"/>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-container>
    <ErrorDialog @closed="showErrorDiag = false" :message="error" v-model="showErrorDiag"/>
</template>

<script setup>
import ErrorDialog from '@/components/ErrorDialog.vue';
import { useAuthStore } from '@/stores/auth';
import { ref } from 'vue';

const auth = useAuthStore()
const name = ref('')
const location = ref('')
const emit = defineEmits(['closed'])

const error = ref('')
const showErrorDiag = ref(false)
const form = ref(null)


const submitForm = async () => {
    try {
        const { valid: formValid} = await form.value.validate()
        if(!formValid) return
        const store = {
            name: name.value,
            location: location.value
        }
        await auth.createInventoryStore(store);
        emit('closed')
    } catch (err) {
        error.value = err
        showErrorDiag.value = true
    }
}
</script>