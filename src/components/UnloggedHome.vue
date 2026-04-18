<template>
    
    <v-container>
        <v-card class="bg-primary">
            <v-card-title class="bg-ternary" >
                Benvingut a Gestoreta
            </v-card-title>
            <v-card-subtitle class="bg-secondary">
                L'aplicació de gestió de falles i casals
            </v-card-subtitle>
        </v-card>
    </v-container>
    <v-container>
        <CreateUserForm/>
    </v-container>
</template>

<style>

</style>

<script setup>

import CreateUserForm from './CreateUserForm.vue';
import LoginForm from './LoginForm.vue';
</script>