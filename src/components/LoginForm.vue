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
  <div class="auth-container">
    <div v-if="!auth.token">
    <h2>Iniciar Sessió</h2>
    <form @submit.prevent="handleLogin" class="login-form">
      <input
        id="email"
        autocomplete="false"
        v-model="email"
        type="email"
        placeholder="Email"
        required
      />
      <input
        id="password"
        v-model="password"
        type="password"
        placeholder="Contrasenya"
        required
      />
      <button type="submit">Entrar</button>
    </form>
    </div>
    
    <p v-if="auth.token">
      <button @click="handleLogout" class="logout-button">Log out</button>
    </p>
    <p v-if="error" style="color: red">{{ error }}</p>
  </div>
</template>

<style>
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
