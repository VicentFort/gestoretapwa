<script setup>
import { useAuthStore } from '@/stores/auth';
import UserUpdateForm from './UserUpdateForm.vue';

const auth = useAuthStore()
</script>

<template>
    <div>
        <h2>Benvingut: {{ auth.userInfo?.name }} {{ auth.userInfo?.surname }}</h2>
        <img src="@/assets/ic_gestoreta_logo.png">
    </div>
</template>

<style>
</style>