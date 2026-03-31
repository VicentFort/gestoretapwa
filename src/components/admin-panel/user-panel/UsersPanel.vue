<template>
    <v-container>
        <v-card class="bg-primary">
            <v-card-title class='bg-ternary'>
                Llistat de membres
            </v-card-title>
            <v-list class="bg-primary">
                <v-list-item 
                    v-for="user in orderedUsers" 
                    :key="user.id"
                    :title="user.name + ' ' + user.surname"
                    link
                    class="text-primary"
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
import { ref, computed } from 'vue';
import UserDetails from './UserDetails.vue';


const auth = useAuthStore()
const users = ref(null)

const orderedUsers = computed(() => {
    let base = users.value 
        ? [...users.value] 
        : [...(auth.fallaAdminInfo?.users || [])];

    if (!base.length) return [];

    return base.sort((a, b) => {
        const nameA = a.name || '';
        const nameB = b.name || '';
        return nameA.localeCompare(nameB);
    });
})
const selectedUser = ref(null)
const isDetailsOpen = ref(false)

const openUserDetails = (user) => {
    isDetailsOpen.value = true
    selectedUser.value = user
}
</script>