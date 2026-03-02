<template>
    <v-dialog v-model="show" width="500">
        <v-card>
            <v-card-title class="bg-secondary">Afig la necessitat</v-card-title>
            <v-text-field
            v-model="description"
            id="description"
            placeholder="Descripció de la necessitat alimentària."
            :required="true"
            />
            <v-divider></v-divider>
            <v-card-actions>
                <v-btn color="grey-darken-1" variant="text" @click="saveNeed" :disabled="description==''">Guarda</v-btn>
            </v-card-actions>

        </v-card>
       
  </v-dialog>
    
</template>

<script setup>
import { useAuthStore } from '@/stores/auth';
import { computed, reactive, ref } from 'vue';
const props = defineProps({
    modelValue: Boolean,
})
const auth = useAuthStore()
const emit = defineEmits(['update:modelValue'])
const show = computed({
    get: () => props.modelValue,
    set: (value) => emit('update:modelValue', value),
})
const description = ref('')
const saveNeed = async () => {
    await auth.addFoodNeed(description)
    show.value = false
}
</script>