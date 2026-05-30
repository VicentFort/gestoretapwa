<template>
  <v-app :theme="gestoreta">
    <v-overlay
    
      :model-value="loadingStore.isLoading"
      class="justify-center align-center"
      persistent
    >
      <v-progress-circular indeterminate size="64" />
    </v-overlay>
    <v-container class="align-center d-flex">
      <v-app-bar class="bg-secondary" color="secondary">
        <v-toolbar-title class="font-weight-bold">
          <v-icon size="large">
            <img
              src="@/assets/ic_gestoreta_logo.png"
              width="40"
              height="40"
              alt="icon"
            />
          </v-icon>
        </v-toolbar-title>

        <v-spacer></v-spacer>

        <div class="hidden-sm-and-down">
          <v-btn to="/" variant="text">Falla</v-btn>
          <v-btn to="/user" variant="text">Usuari</v-btn>
          <v-btn
            v-if="isManager(auth.userInfo?.accessType)"
            to="/adminPanel"
            variant="text"
          >
            Administrar
          </v-btn>
          <v-btn
            v-if="auth.token"
            @click="reloadAll"
            color="success"
            icon="mdi-refresh"
          />
        </div>

        <div class="hidden-md-and-up">
          <v-menu>
            <template v-slot:activator="{ props }">
              <v-btn class="bg-secondary" v-bind="props" icon="mdi-menu" />
            </template>
            <v-list>
              <v-list-item to="/">Falla</v-list-item>
              <v-list-item to="/user">Usuari</v-list-item>
              <v-list-item
                v-if="isManager(auth.userInfo?.accessType)"
                to="/adminPanel"
              >
                Administrar Falla
              </v-list-item>
              <v-divider v-if="auth.token"></v-divider>
              <v-list-item v-if="auth.token">
                <v-btn icon @click="auth.fetchUserInfo()">
                  <v-icon>mdi-refresh</v-icon>
                </v-btn>
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
import { onMounted, ref } from "vue";
import { useAuthStore } from "./stores/auth";
import { useLoadingStore } from "./stores/loadingStore";
import { isManager } from "./stores/checkAccessType";

const loadingStore = useLoadingStore();
const auth = useAuthStore();
const reloadAll = async () => {
  await auth.fetchUserInfo();
};
onMounted(async () => {
  if (auth.token) {
    await auth.fetchUserInfo();
  }
});
</script>
