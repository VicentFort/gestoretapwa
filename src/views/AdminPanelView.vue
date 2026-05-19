<template v-if="isManager(auth.userInfo?.accessType) && auth.fallaAdminInfo">
    <MainPanel/>
</template>

<script setup>
import MainPanel from '@/components/admin-panel/MainPanel.vue';
import { isManager } from '@/stores/checkAccessType';
import { useAuthStore } from '@/stores/auth';
const auth = useAuthStore()

</script>