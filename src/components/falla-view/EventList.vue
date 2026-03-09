<template>
    <v-row class="fill-height">
        <v-col>
            <v-card>
                <v-card-title class="bg-ternary">Llistat d'events</v-card-title>
                <v-list>
                    <v-list-item
                        v-for="event in auth.userInfo.fallaInfo.events" 
                        :key="event.id"
                        :title="event.title"
                        @click="showEvent(event)"
                    >
                </v-list-item>
                </v-list>
                <v-dialog v-model="isDialogOpen" width="auto">
                    <FallaEventDialog v-model="isDialogOpen" :event="selectedEvent"/>
                </v-dialog>        
            </v-card>
        </v-col>
    </v-row>
    
</template>

<script setup>
import { useAuthStore } from '@/stores/auth';
import { ref } from 'vue';
import FallaEventDialog from './FallaEventDialog.vue';


const auth = useAuthStore()
const isDialogOpen = ref(false);
const selectedEvent = ref(null);

const showEvent = (event) => {
  selectedEvent.value = event;
  isDialogOpen.value = true;
};
</script>