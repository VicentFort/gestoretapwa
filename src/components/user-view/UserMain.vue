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
    
    <div v-if="auth.token && auth.userInfo" class="user-container">
        <UserInfo/>
        <v-sheet elevation="2">
        <v-tabs v-model="tab" class="user-tabs">
            <v-tab value="one" class="user-tab">Els meus events</v-tab>
            <v-tab value="two" class="user-tab">Editar perfil</v-tab>
            <v-tab value="three" class="user-tab">Preferències</v-tab>
        </v-tabs>

        <v-divider></v-divider>

        <v-tabs-window v-model="tab">
            <v-tabs-window-item value="one">
                <UserEventInfo/>
            </v-tabs-window-item>
            <v-tabs-window-item value="two">
                <UserUpdateForm/>
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
.user-tab{
    width: auto;
    display: block;
    padding: auto;
    background-color: slateblue;
    border: solid black;
    border-width: 2px;
    max-width: max-content;
    justify-self: center;
}
.user-tabs{
    display: block;
    background-color: slategray;
    flex-direction: row;
    justify-items: center;  
    align-content: center;
    width: 100%;
}
.user-container{
    background-color: slategray;
    display: block;
    width: 100%;
    box-sizing: border-box;
    justify-content: center;
    align-items: center;
    min-height: 20%;
}
</style>