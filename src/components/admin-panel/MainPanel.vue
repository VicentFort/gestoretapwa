<template>
    <v-container>

    <v-card-title>
        Panel de control de la falla:
    </v-card-title>
    <v-card-title>
        {{ auth.fallaAdminInfo?.name }}
    </v-card-title>
    <v-sheet elevation="2">
        <v-tabs v-model="tab" color="primary">
            <v-tab value="one">Events</v-tab>
            <v-tab value="two">Membres</v-tab>
            <v-tab value="three">Pagaments</v-tab>
        </v-tabs>
        </v-sheet>
        <v-divider></v-divider>

        <v-window v-model="tab">
            <v-tabs-window-item value="one">
                <v-row rows="12" md="6">
                    <v-col>
                        <EventPanel/>
                    </v-col>
                    <v-col>
                       <TagPanel/>
                    </v-col>
                </v-row>
                    
                
            </v-tabs-window-item>
            <v-tabs-window-item value="two">
                <UsersPanel/>
                <RequestPanel/>
            </v-tabs-window-item>
            <v-tabs-window-item value="three">
                
            </v-tabs-window-item>
        </v-window>

    </v-container>

</template>

<script setup>
import { useAuthStore } from '@/stores/auth';
import { ref } from 'vue';
import EventPanel from './event-panel/EventPanel.vue';
import UsersPanel from './user-panel/UsersPanel.vue';
import RequestPanel from './user-panel/RequestPanel.vue';
import TagPanel from './event-panel/TagPanel.vue';

const auth = useAuthStore()
if(!auth.fallaAdminInfo) {
    auth.fetchFallaAdminInfo()
}
const tab = ref('one')
</script>