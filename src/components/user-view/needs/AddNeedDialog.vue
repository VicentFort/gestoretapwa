<template>
    <v-dialog v-model="show" width="500">
        <v-card>
            <v-card-title class="text-h6">Afig la necessitat</v-card-title>
            <v-select
                v-model="desc"
                :items="descriptions"
                item-title="description"
                item-value="description"
                label="Selecciona una descripció"
                :rules="[v => !!v || 'Has de seleccionar una descripció']"
                persistent-hint
                variant="outlined"
            >
            <template v-slot:item="{ props, item }">
                <v-list-item
                    v-bind="props"
                    :disabled="item.disabled"
                ></v-list-item>
            </template>
            </v-select>
            <v-divider></v-divider>
            <v-card-actions>
                <v-btn  variant="text" @click="saveNeed"  class="" :disabled="desc==''" icon="mdi-content-save"/>
                <v-btn  variant="text" @click="show=false" class="" icon="mdi-cancel"/>
            </v-card-actions>

        </v-card>
       
  </v-dialog>
    
</template>

<script setup>
import { useAuthStore } from "@/stores/auth";
import { computed, reactive, ref } from "vue";
const props = defineProps({
    modelValue: Boolean,
})
const auth = useAuthStore()
const emit = defineEmits(["update:modelValue"])
const show = computed({
    get: () => props.modelValue,
    set: (value) => emit("update:modelValue", value),
})
const desc = ref("")
const saveNeed = async () => {
    await auth.addFoodNeed(desc.value)
    show.value = false
}
const needs = ref(auth.userInfo?.foodNeeds)
const descriptions = ref([
    { id: 1, description: 'Vegà', disabled:needs.value.some(s => s.description === 'Vegà') },
    { id: 2, description: 'Vegetarià', disabled:needs.value.some(s => s.description === 'Vegetarià') },
    { id: 3, description: 'Celiaquia', disabled:needs.value.some(s => s.description === 'Celiaquia') },
    { id: 4, description: 'Intolerància a la Lactosa', disabled:needs.value.some(s => s.description === 'Intolerància a la Lactosa') },
    { id: 5, description: 'Intolerància a la fructosa', disabled:needs.value.some(s => s.description === 'Intolerància a la fructosa') },
    { id: 6, description: 'Histaminia', disabled:needs.value.some(s => s.description === 'Histaminia') },
    { id: 7, description: 'Al·lèrgia als fruits secs', disabled:needs.value.some(s => s.description === 'Al·lèrgia als fruits secs') },
    { id: 8, description: 'Al·lèrgia als cacus', disabled:needs.value.some(s => s.description === 'Al·lèrgia als cacus') },
    { id: 9, description: 'Al·lèrgia als mariscs', disabled:needs.value.some(s => s.description === 'Al·lèrgia als mariscs') },
    { id: 10, description: 'Al·lèrgia al peix', disabled:needs.value.some(s => s.description === 'Al·lèrgia al peix') },
    { id: 11, description: 'Al·lèrgia als ou', disabled:needs.value.some(s => s.description === 'Al·lèrgia als ou') },
    { id: 12, description: 'Al·lèrgia a la soja', disabled:needs.value.some(s => s.description === 'VAl·lèrgia a la soja') },
    { id: 13, description: 'Kosher', disabled:needs.value.some(s => s.description === 'Kosher') },
    { id: 14, description: 'Halal', disabled:needs.value.some(s => s.description === 'Halal') },
    { id: 15, description: 'Altra', disabled:needs.value.some(s => s.description === 'Altra') }
])
</script>