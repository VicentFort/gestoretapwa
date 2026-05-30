<script setup>
import { useAuthStore } from '@/stores/auth';
import { ref } from 'vue';
import { useDisplay } from 'vuetify/lib/composables/display';
import EventList from './EventList.vue';
import EventCallendar from './EventCallendar.vue';
import FallaInfo from './FallaInfo.vue';
const auth = useAuthStore()
const {xs} = useDisplay()
const tabFalla = ref('one')
</script>

<template>
    <v-container v-if="auth.userInfo.fallaInfo">
        <v-card-title>{{ auth.userInfo.fallaInfo.name }}</v-card-title>
            <v-sheet elevation="2" rounded="lg" :class="xs ?'pa-1' : 'pa-2'">
                <v-tabs v-model="tabFalla" align-tabs="start" class="bg-surface" color="surface" grow>
                    <v-tab value="one">Esdeveniments</v-tab>
                    <v-tab value="two">Informació</v-tab>
                </v-tabs>
            </v-sheet>
            <v-window v-model="tabFalla" class="mt-4" :touch="false">
                <v-window-item value="one" >
                    <v-row rows="12" md="6">
                        <v-col>
                            <EventList/>
                        </v-col>
                        <v-col>
                            <EventCallendar/>
                        </v-col>
                    </v-row>
                </v-window-item>
                    
                <v-window-item value="two">
                    <FallaInfo/>
                </v-window-item>
            </v-window>
    </v-container>
</template>

