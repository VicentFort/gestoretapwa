<template>
    <v-dialog v-model="show" width="500" >
    <v-card v-if="event">
      <v-card-title class="dialog-header" >
        Títol: {{ event?.title }}
      </v-card-title>

      <v-card-text class="pa-4">Descripció: {{ event?.description }}</v-card-text>

      <v-card-text class="pa-4">Data i hora: {{ event?.date }}</v-card-text>

      <v-card-text class="pa-4">Etiqueta {{ event?.tagName }}</v-card-text>

      <v-divider></v-divider>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="grey-darken-1" variant="text" @click="show = false">Tanca</v-btn>
        <v-spacer></v-spacer>
        <v-btn color="grey-darken-1" variant="text" @click="">Afegir al calendari</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { computed, ref } from 'vue';
import {crearEvento} from '@/stores/api'
const props = defineProps({
    modelValue: Boolean,
    event: Object
})
const emit = defineEmits(['update:modelValue'])
const show = computed({
    get: () => props.modelValue,
    set: (value) => emit('update:modelValue', value)
})

const addToCallendar = async () => {
    await crearEvento({
        summary:props.event.title,
        description:props.event.description,
        start: {
            'dateTime': props.event.date, // Formato ISO 8601
            'timeZone': 'Europe/Madrid',
         },
        end: {
            dateTime: props.event.date,
            timeZone: 'Europe/Madrid',
         },
    })
}
</script>

<style>
.dialog-header {
    background-color: slateblue;
    color:white;

    
}
</style>