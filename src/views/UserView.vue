<template>
  <div style="background-color: lightgray; ">
      <UserMain/>
  </div>
</template>

<script>
import UserMain from "@/components/user-view/UserMain.vue";
import { useAuthStore } from "@/stores/auth";

export default {
  name: "UserView",
  components: {
    UserMain,
  },
  setup() {
    const auth = useAuthStore();
    return { auth };
  },
};
</script>

<style>
</style>