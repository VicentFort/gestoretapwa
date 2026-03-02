<script setup>
import { ref } from "vue";
import { useAuthStore } from "@/stores/auth";

const auth = useAuthStore();
const email = ref("");
const password = ref("");
const error = ref("");

const handleLogin = async () => {
  try {
    await auth.login(email.value, password.value);
    error.value = "";
  } catch (err) {
    error.value = err.message;
    console.error(err);
  }
};

const handleLogout = async () => {
  auth.logout();
};
</script>

<template>
  <v-container v-if="!auth.token">
        <v-form ref="form" v-model="valid" @submit.prevent="handleLogin">
          <v-card class="pa-5">
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
              <v-spacer></v-spacer>
              <v-btn type="submit" class="bg-secondary" :disabled="password=='' || email==''">Log in</v-btn>
            </v-card-actions>
          </v-card>
        </v-form>
  </v-container>
  <v-container>
    <v-btn @click="handleLogout" class="bg-secondary">Log out</v-btn>
  </v-container>
</template>

<style scoped>
.auth-container {
  background-color: slategray;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 10%;

}

.login-form {
  width: fit-content;
  padding: 10px;
  display: flex;
  flex-direction: column; /* Pone los inputs uno debajo del otro */
  gap: 15px;             /* Espacio entre campos */
  border: 2px solid transparent;
  border-radius: 10px;
  background: darkorange;
  box-shadow: 0 10px 25px rgba(0,0,0,0.1);
}

.logout-button {
    margin: auto;
    display: flex;
    padding: 1rem;
    border-radius: 8px;
    background-color: white;
    border-color: black;
    border-width: 10%;
    border-style: solid;
    color: black;
}
</style>
