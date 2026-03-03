<template>
    <v-container>
        <v-label clasS='text-primary'>{{ auth.userInfo.fallaInfo.name }}</v-label>
    </v-container>
</template>

<script setup>
import { useAuthStore } from '@/stores/auth';

const auth = useAuthStore()
</script>