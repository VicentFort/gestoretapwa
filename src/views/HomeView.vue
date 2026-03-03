<template>
  <div class="home">
    <p v-if="auth.token">
      <FallaMain />
    </p>
    <p v-if="!auth.token">
      <UnloggedHome/>
    </p>
  </div>
</template>

<script setup>
// @ is an alias to /src
import FallaMain from "@/components/falla-view/FallaMain.vue";
import { useAuthStore } from "@/stores/auth";
import UnloggedHome from "@/components/UnloggedHome.vue";
const auth = useAuthStore();
defineProps({
  components: {
    FallaMain,
  },
});
</script>
