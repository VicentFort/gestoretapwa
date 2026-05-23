<template>
    <v-container>
        <v-card class="bg-primary">
            <v-card-title class="bg-ternary">Pagaments</v-card-title>
            <PaymentTable/>
        </v-card>
    </v-container>
</template>

<script setup>
import { useAuthStore } from '@/stores/auth';
import PaymentTable from './PaymentTable.vue';


const auth = useAuthStore()

</script>