<template>
    <v-dialog v-model="show" width="500">
        <v-form ref="form" v-model="valid" @submit.prevent="submitForm">
                    <v-card>
                    <v-card-title class="text-h6">Afegir etiqueta</v-card-title>
                    <v-row>
                        <v-col cols="12">
                            <v-text-field
                                class="text-black"
                                v-model="tagName"
                                :counter="100"
                                label="Nom d'etiqueta"
                                :rules="[v => !!v || 'Nom necessari']"
                                required
                            ></v-text-field>
                        </v-col>
                    </v-row>
                
                <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn class="text-white" type="submit" :disabled="!valid" icon="mdi-tag-plus"/>
                <v-btn class="text-white" variant="text" @click="show = false" icon="mdi-cancel"/>
            </v-card-actions>
            </v-card>
            </v-form>

            
    </v-dialog>
</template>

<script setup>
import { useAuthStore } from '@/stores/auth';
import { computed, reactive, ref } from 'vue';

const auth = useAuthStore()
const valid = ref(false)
const form = ref(null)
const tagName = ref('')
const props = defineProps({
    modelValue: Boolean
})
const emit = defineEmits(['update:modelValue'])
const show = computed({
    get: () => props.modelValue,
    set: (value) => emit('update:modelValue', value)
})

const submitForm = async () => {
    const { valid: isValid } = await form.value.validate()
    if (isValid) {
        await auth.addTag(tagName.value)
        show.value = false
    }
}
</script>

<style scoped>

</style>