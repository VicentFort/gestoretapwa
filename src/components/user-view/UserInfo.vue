<script setup>
import { useAuthStore } from '@/stores/auth';
import { computed } from 'vue';
import { useDisplay } from 'vuetify/lib/composables/display';
const auth = useAuthStore()
const mobile = useDisplay()
</script>

<template>
    <v-container>
        <v-label class='text-black' :text="'Hola: '"></v-label>
        <br>
        <v-label class='text-black'>{{ auth.userInfo.name }} {{ auth.userInfo.surname }} </v-label>
        <br v-if="auth.userInfo?.nickname">
        <v-label v-if="auth.userInfo?.nickname" class='text-black'>{{ auth.userInfo?.nickname }}</v-label>
        <v-img>
            <img width="40" height="40" src="../../assets/user_ph.png">
        </v-img>
    </v-container>    
</template>

<style>

</style>