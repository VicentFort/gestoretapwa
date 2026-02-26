<template>
  <nav style="text-align: left;">
    <router-link to="/" class="text-router-link">Falla</router-link> |
    <router-link to="/user" class="text-router-link">Usuari</router-link> |
    <router-link to="/adminPanel" v-if="auth.userInfo?.adminAccess">Administrar Falla</router-link>
  </nav>
  <router-view/>
</template>
<script setup>
import { useAuthStore } from './stores/auth';

const auth = useAuthStore()
</script>
<style lang="css">
@import './style/main.css'
</style>
