<template>
    
    <v-container>
        <v-card>
            <v-card-title text-h6  >
                Benvingut a Gestoreta
            </v-card-title>
            <v-card-subtitle class="text-h6">
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