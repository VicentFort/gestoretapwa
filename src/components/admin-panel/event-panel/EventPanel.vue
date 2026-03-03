<script setup>
import { ref } from 'vue';
import EventDialog from './EventDialog.vue';
import { useAuthStore } from '@/stores/auth';
import EventCreateDialog from './EventCreateDialog.vue';
const auth = useAuthStore()
const isDetailsOpen = ref(false);
const isCreateOpen = ref(false)
const selectedEvent = ref(null);

const openDetails = (event) => {
  selectedEvent.value = event;
  isDetailsOpen.value = true;
};

const openCreateEvent = () => {
    isCreateOpen.value = true
}
</script>

<template>
    <v-container>
        <v-card>
            <v-card-title class='bg-ternary'>
                Llistat d'events
            </v-card-title>
            <v-list>
                <v-list-item 
                    v-for="event in auth.fallaAdminInfo.events" 
                    :key="event.id"
                    :title="event.title"
                    link 
                    @click="openDetails(event)"
                >
            </v-list-item>
            </v-list>
            <v-divider></v-divider>


            <v-dialog v-model="isDetailsOpen" width="auto">
                <EventDialog v-model="isDetailsOpen" :event="selectedEvent"/>
            </v-dialog>
            <v-dialog v-model="isCreateOpen" width="auto">
                <EventCreateDialog v-model="isCreateOpen"/>
            </v-dialog>
            <v-card-actions class="justify-center">
               <v-btn class="justify-center bg-secondary" type="text" @click='openCreateEvent'>Crear Event</v-btn> 
            </v-card-actions>
        </v-card>
    </v-container>
</template>