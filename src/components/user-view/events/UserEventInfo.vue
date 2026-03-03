<script setup>
import { useAuthStore } from '@/stores/auth';
import UserEventDialog from './UserEventDialog.vue';
import { ref } from 'vue';
import UserEventAttDialog from './UserEventAttDialog.vue';


const auth = useAuthStore()
const isDialogOpen = ref(false);
const selectedEvent = ref(null);

const isAttDialogOpen = ref(false);
const selectedAttEvent = ref(null)

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
            <v-card>
                <v-card-title class="bg-ternary">Assistències</v-card-title>
                <v-list>
                    <v-list-item
                        v-for="event in auth.userInfo.events" 
                        :key="event.id"
                        :title="event.title"
                        @click="showEvent(event)"
                    >
                    </v-list-item>
                </v-list>
            </v-card>
    </v-container>
    <v-container>
            <v-divider></v-divider>
             <v-card>
                <v-card-title class="bg-ternary">Events amb càrrec</v-card-title>
                <v-list>
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
</template>

<style scoped>
</style>