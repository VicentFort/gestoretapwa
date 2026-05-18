<template v-if="(auth.userInfo?.accessType == 'Gestor' || auth.userInfo?.accessType == 'Superusuari')">
    <MainPanel/>
</template>

<script setup>
import MainPanel from '@/components/admin-panel/MainPanel.vue';
import { useAuthStore } from '@/stores/auth';
const auth = useAuthStore()

</script>