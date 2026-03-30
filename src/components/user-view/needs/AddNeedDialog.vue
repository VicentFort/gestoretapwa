<template>
    <v-dialog v-model="show" width="500">
        <v-card class="bg-primary">
            <v-card-title class="bg-ternary">Afig la necessitat</v-card-title>
            <v-select
                v-model="description"
                :items="descriptions"
                label="Selecciona una descripció"
                :rules="[v => !!v || 'Has de seleccionar una descripció']"
                persistent-hint
                variant="outlined"
            ></v-select>
            <v-divider></v-divider>
            <v-card-actions>
                <v-btn  variant="text" @click="saveNeed"  class="bg-ternary" :disabled="description==''">Guarda</v-btn>
                <v-btn  variant="text" @click="show=false" class="bg-ternary">Tanca</v-btn>
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
    await auth.addFoodNeed(description.value)
    show.value = false
}

const descriptions = ref([
    'Vegà',
    'Vegetarià',
    'Celiaquia',
    'Intolerància a la Lactosa',
    'Intolerància a la fructosa',
    'Histaminia',
    'Al·lèrgia als fruits secs',
    'Al·lèrgia als cacus',
    'Al·lèrgia als mariscs',
    'Al·lèrgia al peix',
    'Al·lèrgia als ou',
    'Al·lèrgia a la soja',
    'Kosher',
    'Halal',
    'Altra'
])
</script>