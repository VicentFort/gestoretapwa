<script setup>
import { useAuthStore } from '@/stores/auth';
import UserInfo from '@/components/user-view/UserInfo.vue';
import LoginForm from '../LoginForm.vue';
import { ref } from 'vue';
import UserUpdateForm from '@/components/user-view/user-update/UserUpdateForm.vue';
import UserEventInfo from './events/UserEventInfo.vue';
import UserNeedsInfo from './needs/UserNeedsInfo.vue';
import { useDisplay } from 'vuetify/lib/composables/display';
import UserPrefsInfo from './needs/UserPrefsInfo.vue';
const auth = useAuthStore()
const tab = ref('one')
const mobile = useDisplay()
</script>

<template>
        <v-col justify="center" v-if="auth.token && auth.userInfo">
            <v-row rows="12" md="6">
                <v-container>
                    <UserInfo/>
                    <v-sheet elevation="2" rounder="lg" :class="mobile ?'pa-1' : 'pa-5'">
                        <v-tabs v-model="tab" color="primary" :direction="mobile ? 'horizontal' : 'vertical'">
                            <v-tab value="one" :class="mobile ?'pa-1': 'pa-5'">Els meus events</v-tab>
                            <v-tab value="two">Editar perfil</v-tab>
                            <v-tab value="three">Preferències</v-tab>
                        </v-tabs>
                    </v-sheet>
                    <v-window v-model="tab" class="mt-4">
                        <v-window-item value="one" >
                            <UserEventInfo/>
                        </v-window-item>

                        <v-window-item value="two">
                            <UserUpdateForm/>
                        </v-window-item>

                        <v-window-item value="three">
                            <v-row rows="12" md="6">
                                <v-col> 
                                    <UserNeedsInfo/>
                                </v-col>
                                <v-col>
                                    <UserPrefsInfo/>
                                </v-col>
                            </v-row>
                        </v-window-item>
                    </v-window>
                </v-container>
            <v-container v-if="auth.token">
                <v-btn @click="handleLogout" class="bg-ternary">Log out</v-btn>
            </v-container> 
        </v-row>
    </v-col> 
    <v-container v-if="!auth.token">
        <LoginForm/>
    </v-container>
</template>

<style scoped>

</style>