<template>
    <v-container>
    <v-form @submit.prevent="submitForm" ref="form" v-model="valid">
        <v-card class="bg-primary">
            <v-card-title class="text-primary font-weight-bold bg-ternary">
                Crear un nou Item
            </v-card-title>
            <v-col>
                <v-row rows="12" md="6">
                    <v-text-field 
                    label="Nom"
                    v-model="name"
                    type="text"
                    required
                    >    
                    </v-text-field>
                </v-row>
                <v-row rows="12" md="6">
                    <v-text-field 
                    label="Descripció"
                    v-model="description"
                    type="text"
                    required
                    >
                    </v-text-field>
                </v-row>
                <v-row rows="12" md="6">
                    <v-select
                    :items="categories"
                    v-model="selectedCategory"
                    label="Categoria"
                    >
                    </v-select>
                </v-row>
            </v-col>
            <v-card-actions>
                <v-btn class="align-left bg-ternary" icon="mdi-cancel" @click="emit('closed')"></v-btn>

                <v-btn class="bg-ternary" type="submit" :disabled="description=='' || name=='' || selectedCategory==''" icon="mdi-plus"></v-btn>
            </v-card-actions>
        </v-card>
    </v-form>
    <v-dialog v-model="showErrorDiag" width="400px">
            <v-card class="bg-primary">
                <v-card-title class="text-white bg-error">Error</v-card-title>
                <v-card-text>{{ error }}</v-card-text>
                <v-card-actions>
                    <v-btn type="error", variant="text" @click="showErrorDiag=false">Tanca</v-btn>
                </v-card-actions>
            </v-card>
    </v-dialog>
    </v-container>
    <ErrorDialog @closed="showErrorDiag = false" :message="error" v-model="showErrorDiag"/>
</template>

<script setup>
import ErrorDialog from '@/components/ErrorDialog.vue';
import { useAuthStore } from '@/stores/auth';
import { itemCategories } from '@/stores/backendEnums';
import { ref, defineEmits } from 'vue';

const auth = useAuthStore()

const valid = ref(false)
const form = ref(null)

const name = ref('')
const description = ref('')

const emit = defineEmits(['closed'])

const error = ref('')
const showErrorDiag = ref(false)

const selectedCategory = ref('')
const categories = itemCategories

const submitForm = async () => {
    try {
        const {valid: formValid} = await form.value.validate()
        if(!formValid) return
        const newItem = {
            name: name.value,
            description: description.value,
            category: selectedCategory.value
        }
        await auth.createNewInventoryItem(newItem)
        emit('closed')
    } catch(err) {
        error.value = err
        showErrorDiag.value = true
    }
}
 
</script>