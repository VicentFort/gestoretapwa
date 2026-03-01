<template>
    <div>
    <h2>Panel de control de la falla: {{ auth.fallaAdminInfo?.name }}</h2>
    <v-sheet elevation="2">
        <v-tabs v-model="tab" color="primary">
            <v-tab value="one">Events</v-tab>
            <v-tab value="two">Item Two</v-tab>
            <v-tab value="three">Item Three</v-tab>
        </v-tabs>

        <v-divider></v-divider>

        <v-tabs-window v-model="tab">
            <v-tabs-window-item value="one">
                <EventPanel/>
            </v-tabs-window-item>
            <v-tabs-window-item value="two">
                
            </v-tabs-window-item>
            <v-tabs-window-item value="three">
                
            </v-tabs-window-item>
        </v-tabs-window>

    </v-sheet>
    </div>
</template>

<script setup>
import { useAuthStore } from '@/stores/auth';
import { ref } from 'vue';
import EventPanel from './EventPanel.vue';

const auth = useAuthStore()
auth.fetchFallaAdminInfo()
const tab = ref('one')
</script>