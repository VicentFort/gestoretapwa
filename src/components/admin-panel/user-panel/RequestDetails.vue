<template>
    <v-dialog v-model="show" width="500">
        <v-card v-if="request" class="bg-primary">
            <v-card-title class="text-h5 text-black bg-ternary">Solicitud de: {{ request.username }}</v-card-title>
            <v-card-text class="pa-4">Missatge: {{ request.message }}</v-card-text>

            <v-divider></v-divider>

            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn class="bg-secondary" variant="text" @click="show = false">
                Tanca
                </v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script setup>
import { computed } from 'vue';


const props = defineProps({
    modelView : Boolean,
    request: Object
})
const emit = defineEmits(['update:modelValue'])
const show = computed({
    get: () => props.modelValue,
    set: (value) => emit('update:modelValue', value)
})
</script>