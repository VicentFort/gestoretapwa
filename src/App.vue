<template>
  <nav style="text-align: left; ">
    <v-btn v-if="auth.token" class="reload-btn" @click="reloadAll">Reload</v-btn>
    <router-link to="/" class="text-router-link">Falla</router-link> |
    <router-link to="/user" class="text-router-link">Usuari</router-link> |
    <router-link to="/adminPanel" v-if="auth.userInfo?.adminAccess">Administrar Falla</router-link>
    
  </nav>
  <router-view/>
</template>
<script setup>
import { useAuthStore } from './stores/auth';

const auth = useAuthStore()
const reloadAll = async () => {
  await auth.fetchUserInfo()
}
</script>
<style lang="css">
@import './style/main.css';
.reload-btn {
  margin-right: 20px;
  justify-self: right;
  align-self: right;
  justify-content: right;
  align-content: right;

}

</style>
