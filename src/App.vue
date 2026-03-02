<template>
  <v-app>
    <v-container class="d-flex align-center">
      <v-app-bar>

      <v-toolbar-title class="font-weight-bold text-primary" >
        Gestoreta
      </v-toolbar-title>

      <v-spacer></v-spacer>

      <div class="hidden-sm-and-down">
        <v-btn to="/" variant="text">Falla</v-btn>
        <v-btn to="/user" variant="text">Usuari</v-btn>
        <v-btn 
          v-if="auth.userInfo?.adminAccess" 
          to="/adminPanel" 
          variant="text" 
          color="secondary"
        >
          Administrar
        </v-btn>
        <v-btn 
          v-if="auth.token" 

          @click="reloadAll" 
          color="grey"
        >Reload</v-btn>
      </div>

      <div class="hidden-md-and-up">
        <v-menu>
          <template v-slot:activator="{ props }">
            <v-btn class="bg-secondary" v-bind="props"></v-btn>
          </template>
          <v-list>
            <v-list-item to="/">Falla</v-list-item>
            <v-list-item to="/user">Usuari</v-list-item>
            <v-list-item v-if="auth.userInfo?.adminAccess" to="/adminPanel">
              Administrar Falla
            </v-list-item>
            <v-divider v-if="auth.token"></v-divider>
            <v-list-item v-if="auth.token" @click="reloadAll" prepend-icon="mdi-refresh">
              Reload
            </v-list-item>
          </v-list>
        </v-menu>
      </div>
        </v-app-bar>
    </v-container>

  <v-main>
    <router-view />
  </v-main>

  </v-app>
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
