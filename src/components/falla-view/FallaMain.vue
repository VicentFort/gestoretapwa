<script setup>
import { useAuthStore } from '@/stores/auth';
import { ref } from 'vue';
const auth = useAuthStore()
const fallaName = ref(auth.getFallaInfo?.name || '')
</script>

<template>
    <div>
        <h1>Falla: {{ auth.fallaInfo?.name }}</h1>
        <button v-if="auth.userInfo?.adminAccess">Editar falla</button>
    </div>
</template>