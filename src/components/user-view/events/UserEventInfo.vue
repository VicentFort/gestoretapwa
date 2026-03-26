<script setup>
import { useAuthStore } from '@/stores/auth';
import UserEventDialog from './UserEventDialog.vue';
import { ref } from 'vue';
import UserEventAttDialog from './UserEventAttDialog.vue';
import UserEventFilter from './UserEventFilter.vue';


const auth = useAuthStore()
const isDialogOpen = ref(false);
const selectedEvent = ref(null);

const isAttDialogOpen = ref(false);
const selectedAttEvent = ref(null)
// 1. Inicializamos con los eventos actuales del store
const events = ref(auth.userInfo?.events ? [...auth.userInfo.events] : [])

// 2. Esta función debe actualizar la variable 'events' que usa el v-for
const handleFilter = (filteredList) => {
    // Si filteredList llega, lo asignamos. 
    // Si por alguna razón llegara vacío o null al vaciar, 
    // nos aseguramos de traer la lista maestra del store.
    events.value = filteredList || [...auth.userInfo.events];
};

const showAttEvent = (event) => {
    selectedAttEvent.value = event
    isAttDialogOpen.value = true
}

const showEvent = (event) => {
  selectedEvent.value = event;
  isDialogOpen.value = true;
};
</script>

<template>
    <v-container>
        <v-row rows="12" md="6">
        <v-col>
                <v-container>
                    <v-card class="bg-primary">
                        <v-card-title class="bg-ternary">Assistències</v-card-title>
                        <v-list class="bg-primary">
                            <v-list-item
                                v-for="event in events" 
                                :key="event.id"
                                :title="event.title"
                                @click="showEvent(event)"
                            >
                            </v-list-item>
                        </v-list>
                        <v-card-actions class="justify-center align-center">
                            <UserEventFilter @update-filter="handleFilter"></UserEventFilter>
                        </v-card-actions>
                    </v-card>
                </v-container>
        </v-col>
        <v-col>
                <v-container>
                    <v-divider></v-divider>
                    <v-card>
                        <v-card-title class="bg-ternary">Events amb càrrec</v-card-title>
                        <v-list class="bg-primary">
                            <v-list-item
                                v-for="event in auth.userInfo?.attEvents" 
                                :key="event.id"
                                :title="event.title"
                                @click="showAttEvent(event)"
                            >
                            </v-list-item>
                        </v-list>
                    </v-card>
                    <v-dialog v-model="isDialogOpen" width="auto">
                        <UserEventDialog v-model="isDialogOpen" :event="selectedEvent"/>
                    </v-dialog>
                    <v-dialog v-model="isAttDialogOpen" width="auto">
                        <UserEventAttDialog v-model="isAttDialogOpen" :event="selectedAttEvent"/>
                    </v-dialog>
                </v-container> 
        </v-col> 
        </v-row>
    </v-container>
    
     
</template>

<style>
.v-card{
    border-color: #FF7F50;
    border-width: 10px;
    border-style: solid;
}
</style>