<script setup>
import { useAuthStore } from '@/stores/auth';
import { ref } from 'vue';
const auth = useAuthStore()
const fallaName = ref(auth.getFallaInfo?.name || '')
</script>

<template>
    <div v-if="auth.fallaInfo">
        <h1>Falla: {{ auth.fallaInfo?.name }}</h1>
    </div>
    <dif v-if="!auth.fallaInfo">
        <h1>No tens falla</h1>
    </dif>
</template>

