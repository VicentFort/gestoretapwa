<template v-if="auth.userInfo?.adminAccess">
    <MainPanel/>
</template>

<script setup>
import MainPanel from '@/components/admin-panel/MainPanel.vue';
import { useAuthStore } from '@/stores/auth';
const auth = useAuthStore()

</script>