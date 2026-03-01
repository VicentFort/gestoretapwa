<script setup>
import { useAuthStore } from '@/stores/auth';
import { ref } from 'vue';
const auth = useAuthStore()
</script>

<template>
    <div v-if="auth.userInfo.fallaInfo">
        <h1>Falla: {{ auth.userInfo.fallaInfo.name }}</h1>
    </div>
    <dif v-if="!auth.userInfo.fallaInfo">
        <h1>No tens falla</h1>
    </dif>
</template>

