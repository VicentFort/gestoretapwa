<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="12" md="6" class="flex-column align-center text-center d-flex">
        
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { useAuthStore } from "@/stores/auth";

const auth = useAuthStore();
</script>
