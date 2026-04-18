<script setup>
import { ref } from "vue";
import { useAuthStore } from "@/stores/auth";
import ErrorDialog from "./ErrorDialog.vue";

const auth = useAuthStore();
const showErrorDiag = ref(false)
const email = ref("");
const password = ref("");
const error = ref("");

const handleLogin = async () => {
  try {
    await auth.login(email.value, password.value);
    error.value = "";
  } catch (err) {
    error.value = err;
    showErrorDiag.value = true;
  }
};

const handleLogout = async () => {
  email.value=''
  password.value=''
  auth.logout();
};

const closeError = async () => {
  error.value = ''
  showErrorDiag.value = false
}
</script>

<template>
  <v-container v-if="!auth.token">
        <v-form ref="form" v-model="valid" @submit.prevent="handleLogin">
          <v-card class="bg-primary pa-5">
            <v-card-title class="bg-ternary">Log In</v-card-title>
            <v-row>
              <v-col cols="12" md="6">
                <v-text-field
                    v-model="email"
                    type="email"
                    label="Correu electrònic"
                    required
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                    v-model="password"
                    type="password"
                    label="Contrasenya"
                    required
                ></v-text-field>
              </v-col>
            </v-row>
            <v-card-actions>
              <v-spacer/>
              <v-btn type="submit" class="bg-ternary" :disabled="password=='' || email==''">Log in</v-btn>
            </v-card-actions>
          </v-card>
        </v-form>
    </v-container>
    
    <ErrorDialog :message="error" v-model="showErrorDiag" @closed="showErrorDiag=false"/>
</template>

<style scoped>
</style>
