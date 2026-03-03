<template>
    <v-card>
        <v-card-title class="text-h2">
            Benvingut a Gestoreta
        </v-card-title>
        <v-card-subtitle class="text-h5">
            L'aplicació de gestió de falles i casals
        </v-card-subtitle>
    </v-card>

    <v-card>
        <v-card-title class="text-primary">
            Crea un usuari
        </v-card-title>
        <CreateUserForm/>
    </v-card>

</template>

<style>

</style>

<script setup>

import CreateUserForm from './CreateUserForm.vue';
</script>