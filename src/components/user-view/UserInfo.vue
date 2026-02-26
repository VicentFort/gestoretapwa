<script setup>
import { useAuthStore } from '@/stores/auth';

const auth = useAuthStore()
</script>

<template>
    <div class="user-info-container">
        <h2>Benvingut: {{ auth.userInfo?.name }} {{ auth.userInfo?.surname }}</h2>
        <img src="@/assets/ic_gestoreta_logo.png">
    </div>
</template>

<style>
.user-info-container{
    background-color: slategray;
}
</style>