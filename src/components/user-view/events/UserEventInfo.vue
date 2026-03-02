<script setup>
import { useAuthStore } from '@/stores/auth';
import UserEventDialog from './UserEventDialog.vue';
import { ref } from 'vue';


const auth = useAuthStore()
const isDialogOpen = ref(false);
const selectedEvent = ref(null);

const showEvent = (event) => {
  selectedEvent.value = event;
  isDialogOpen.value = true;
};
</script>

<template>
    <v-container>
            <v-list>
                <v-list-item
                    v-for="event in auth.userInfo.events" 
                    :key="event.id"
                    :title="event.title"
                    @click="showEvent(event)"
                >
            </v-list-item>
            </v-list>
            <v-dialog v-model="isDialogOpen" width="auto">
                <UserEventDialog v-model="isDialogOpen" :event="selectedEvent"/>
            </v-dialog>
        </v-container>

</template>

<style scoped>
</style>