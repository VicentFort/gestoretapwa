<template>
  <v-container>
    <v-card>
      <v-card-title class="text-h6">Pagaments</v-card-title>
      <PaymentTable />
    </v-card>
  </v-container>
</template>

<script setup>
import { useAuthStore } from "@/stores/auth";
import PaymentTable from "./PaymentTable.vue";

const auth = useAuthStore();
</script>
