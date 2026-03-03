<script setup>
import { useAuthStore } from '@/stores/auth';
import AddNeedDialog from '@/components/user-view/needs/AddNeedDialog.vue';
import { ref } from 'vue';
import DeleteNeedDialog from './DeleteNeedDialog.vue';
import { useDisplay } from 'vuetify/lib/composables/display';
const mobile = useDisplay()
const auth = useAuthStore()
const isDialogOpen = ref(false)
const isDeleteOpen = ref(false)
const selectedNeed = ref(null)
const openDialog = () => {
    isDialogOpen.value = true
}
const deleteNeed = (need) => {
    isDeleteOpen.value = true
    selectedNeed.value = need
}
</script>

<template>
    <v-container v-if="auth.userInfo?.foodNeeds">
        <v-card>
           <v-card-title class="bg-ternary">Les meues preferències alimentàries:</v-card-title>
           <v-list>
                <v-list-item
                    v-for="need in auth.userInfo?.foodNeeds" 
                    :key="need.foodNeedId"
                    :title="need.description"
                    @click="deleteNeed(need)"
                >
            </v-list-item>
            </v-list>
            <v-divider>
                
            </v-divider>
            <v-card-actions class="justify-center">
                <v-btn @click="openDialog" class="bg-secondary">Afegir Necessitat</v-btn>
            </v-card-actions>
            <v-dialog v-model="isDialogOpen">
                <AddNeedDialog v-model="isDialogOpen" ></AddNeedDialog>
            </v-dialog>
            <v-dialog v-model="isDeleteOpen">
                 <DeleteNeedDialog v-model="isDeleteOpen" :need="selectedNeed"></DeleteNeedDialog>
            </v-dialog>
        </v-card>
    </v-container>
</template>

<style scoped>
</style>