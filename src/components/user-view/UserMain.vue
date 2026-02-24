<script setup>
import { useAuthStore } from '@/stores/auth';
import UserInfo from '@/components/user-view/UserInfo.vue';
import LoginForm from '../LoginForm.vue';
import { ref } from 'vue';
import UserUpdateForm from './UserUpdateForm.vue';
import UserEventInfo from './UserEventInfo.vue';
const auth = useAuthStore()
const tab = ref('one')
</script>

<template>
    
    <div v-if="auth.token && auth.userInfo">
        <UserInfo/>
        <v-sheet elevation="2">
        <v-tabs v-model="tab">
            <v-tab value="one">Editar perfil</v-tab>
            <v-tab value="two">Els meus events</v-tab>
            <v-tab value="three">Preferències</v-tab>
        </v-tabs>

        <v-divider></v-divider>

        <v-tabs-window v-model="tab">
            <v-tabs-window-item value="one">
                <UserUpdateForm/>
            </v-tabs-window-item>
            <v-tabs-window-item value="two">
                <UserEventInfo/>
            </v-tabs-window-item>
            <v-tabs-window-item value="three">
                
            </v-tabs-window-item>
        </v-tabs-window>

    </v-sheet>
    </div>
    <div>
     <LoginForm />   
    </div>
    
    
</template>

<style>

</style>