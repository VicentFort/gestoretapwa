<template>
  <v-app>
    <v-container class="align-center d-flex">
      <v-app-bar>

      <v-toolbar-title class="font-weight-bold text-primary">
        <v-icon size="large">
          <img src="@/assets/ic_gestoreta_logo.png" width=40 height=40  alt="icon" />
        </v-icon>
      </v-toolbar-title>

      <v-spacer></v-spacer>

      <div class="hidden-sm-and-down">
        <v-btn to="/" variant="text">Falla</v-btn>
        <v-btn to="/user" variant="text">Usuari</v-btn>
        <v-btn 
          v-if="auth.userInfo?.adminAccess" 
          to="/adminPanel" 
          variant="text" 
          color="primary"
        >
          Administrar
        </v-btn>
        <v-btn 
          v-if="auth.token" 

          @click="reloadAll" 
          color="grey"
          icon="mdi-refresh"
        ></v-btn>
      </div>

      <div class="hidden-md-and-up">
        <v-menu>
          <template v-slot:activator="{ props }">
            <v-btn class="bg-secondary" v-bind="props" icon="mdi-menu"></v-btn>
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


</style>
