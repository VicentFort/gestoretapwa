<script setup>
import { useAuthStore } from '@/stores/auth';
import { ref } from 'vue';
import { useDisplay } from 'vuetify/lib/composables/display';
import EventList from './EventList.vue';
import EventCallendar from './EventCallendar.vue';
import FallaInfo from './FallaInfo.vue';
const auth = useAuthStore()
const mobile = useDisplay()
const tabFalla = ref('one')
</script>

<template>
    <v-container>
        <v-col class="justify-center">
            <v-row rows="12" md="6">
                <v-container v-if="auth.userInfo.fallaInfo">
                    <v-card-title>{{ auth.userInfo.fallaInfo.name }}</v-card-title>
                    <v-sheet elevation="2" rounder="lg" :class="mobile ?'pa-1' : 'pa-5'">
                        <v-tabs v-model="tabFalla" color="primary" :direction="mobile ? 'horizontal' : 'vertical'">
                            <v-tab value="one" :class="mobile ?'pa-1': 'pa-5'">Informació</v-tab>
                            <v-tab value="two">Events</v-tab>
                            <v-tab value="three">Preferències</v-tab>
                        </v-tabs>
                    </v-sheet>
                    <v-window v-model="tabFalla" class="mt-4">
                        <v-window-item value="one" >
                            <FallaInfo/>
                        </v-window-item>
                            
                        <v-window-item value="two">
                            <EventList/>
                            <EventCallendar/>
                        </v-window-item>

                        <v-window-item value="three">
                        </v-window-item>
                    </v-window>
                </v-container>
                <v-container v-if="!auth.userInfo.fallaInfo">

                </v-container>
            </v-row>
        </v-col>
    </v-container>
</template>

