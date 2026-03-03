<template>
   <v-container>
        <v-card>
            <v-card-title class='bg-ternary'>
                Llistat de solicituds
            </v-card-title>
            <v-list>
                <v-list-item 
                    v-for="req in auth.fallaAdminInfo.requests" 
                    :key="req.requestId"
                    :title="req.message"
                    link
                    @click="openRequestDetails(req)"
                >
            </v-list-item>
            </v-list>
            <v-divider></v-divider>


            <v-dialog v-model="isDetailsOpen" width="auto">
                <RequestDetails v-model="isDetailsOpen" :request="selectedRequest"/>
            </v-dialog>
        </v-card>
    </v-container> 
</template>

<script setup>
import { useAuthStore } from '@/stores/auth';
import { ref } from 'vue';
import RequestDetails from './RequestDetails.vue';

const auth = useAuthStore()
const isDetailsOpen = ref(false)
const selectedRequest = ref(null)

const openRequestDetails = (req) => {
    isDetailsOpen.value = true
    selectedRequest.value = req
}


</script>