<template>
    <v-container>
        <v-card>
            <v-card-title class='bg-ternary'>
                Llistat de membres
            </v-card-title>
            <v-list>
                <v-list-item 
                    v-for="user in auth.fallaAdminInfo.users" 
                    :key="user.id"
                    :title="user.name + ' ' + user.surname"
                    link
                    @click="openUserDetails(user)"
                >
            </v-list-item>
            </v-list>
            <v-divider></v-divider>


            <v-dialog v-model="isDetailsOpen" width="auto">
                <UserDetails v-model="isDetailsOpen" :user="selectedUser"/>
            </v-dialog>
        </v-card>
    </v-container>
</template>

<script setup>
import { useAuthStore } from '@/stores/auth';
import { ref } from 'vue';
import UserDetails from './UserDetails.vue';


const auth = useAuthStore()
const selectedUser = ref(null)
const isDetailsOpen = ref(false)

const openUserDetails = (user) => {
    isDetailsOpen.value = true
    selectedUser.value = user
}
</script>