<template>
    <v-dialog v-model="show" width="500">
        <v-card>
            <input
            v-model="props.description"
            id="description"
            placeholder="Descripció de la necessitat alimentària."
            :required="true"
            >
            <v-divider></v-divider>
            <v-card-actions>
                <v-btn color="grey-darken-1" variant="text" @click="saveNeed">Guarda</v-btn>
            </v-card-actions>

        </v-card>
        
       
  </v-dialog>
    
</template>

<script setup>
import { useAuthStore } from '@/stores/auth';
import { computed, ref } from 'vue';
const props = defineProps({
    modelValue: Boolean,
    description: String
})
const auth = useAuthStore()
const emit = defineEmits(['update:modelValue'])
const show = computed({
    get: () => props.modelValue,
    set: (value) => emit('update:modelValue', value),
})

const saveNeed = async () => {
    await auth.addFoodNeed(description.value)
    show.value = false
}
</script>