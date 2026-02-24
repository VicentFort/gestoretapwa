<script setup>
import { useEventStore } from '@/stores/event';
import { ref } from 'vue';
import EventDialog from './EventDialog.vue';
const eventStore = useEventStore()
eventStore.fetchFallaEvents()
const eventsFalla = ref(eventStore.fallaEvents || null)
const isDialogOpen = ref(false);
const selectedEvent = ref(null);

const openDetails = (event) => {
  selectedEvent.value = event;
  isDialogOpen.value = true;
};
</script>

<template>
    <h2>Llistat d'events</h2>
    <v-list>
        <v-list-item 
            v-for="event in eventStore.fallaEvents" 
            :key="event.id"
            :title="event.title"
            link 
            @click="openDetails(event)"
        >
      </v-list-item>
    </v-list>

    <v-dialog v-model="isDialogOpen" width="auto">
        <EventDialog v-model="isDialogOpen" :event="selectedEvent"/>
    </v-dialog>
</template>