<template>
   <v-container>
        <v-card title="Llistat de sol·licituds">

            <v-data-table-virtual
            :items="computedRequests"
            :headers="headers"
            hide-default-footer
            >
                <template #item="{ item }">
                    <tr class="responsive-tr">
                        <td class="justify-center responsive-td" data-label="Nom">{{ item.username }}</td>
                        <td class="responsive-td" data-label="Missatge">{{ item.message }}</td>
                        <td class="responsive-td" data-label="Accions">
                            <div class="justify-center align-center d-flex">
                                <v-btn @click="openRequestDetails(item)" icon="mdi-magnify"/>
                            </div>
                        </td>
                    </tr>
                </template>
            </v-data-table-virtual>
            <v-divider></v-divider>


            <v-dialog v-model="isDetailsOpen" width="auto">
                <RequestDetails v-model="isDetailsOpen" :request="selectedRequest"/>
            </v-dialog>
        </v-card>
    </v-container> 
</template>

<script setup>
import { useAuthStore } from '@/stores/auth';
import { computed, ref } from 'vue';
import RequestDetails from './RequestDetails.vue';

const auth = useAuthStore()
const isDetailsOpen = ref(false)
const selectedRequest = ref(null)

const openRequestDetails = (req) => {
    isDetailsOpen.value = true
    selectedRequest.value = req
}

const computedRequests = computed(() => {
    return auth.fallaAdminInfo.requests.filter(r => r.aproved === null)
})

const headers = [
    {
        title:"Nom",
        key:"username",
        align:"center",
        cellProps: {
            class:""
        },
        headerProps: {
            class: " font-weight-bold"
        }
    },
    {
        title:"Missatge",
        key:"message",
        align:"center",
        cellProps: {
            class:""
        },
        headerProps: {
            class: " font-weight-bold"
        }
    },
    {
        title:"Accions",
        key:"actions",
        align:"center",
        cellProps: {
            class:""
        },
        headerProps: {
            class: " font-weight-bold"
        }
    }
]

</script>