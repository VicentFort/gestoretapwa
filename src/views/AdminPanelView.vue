<template v-if="isManager(auth.userInfo?.accessType) && auth.fallaAdminInfo">
  <MainPanel />
</template>

<script setup>
import MainPanel from "@/components/admin-panel/MainPanel.vue";
import { isManager } from "@/stores/checkAccessType";
import { useAuthStore } from "@/stores/auth";
import { computed } from "vue";
import router from "@/router";
const auth = useAuthStore();

const checkToken = computed(() => {
  if (!auth.token) {
    auth.logout();
    router.push({ name: "Login" });
  }
});
</script>
