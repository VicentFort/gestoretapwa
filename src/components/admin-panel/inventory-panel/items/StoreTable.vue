<template>
    <v-container>
        <v-card>
            <v-data-table-virtual 
            :items="stores"
            :headers="headers"
            hide-default-footer
            class="bg-ternary elevation-1"
            style="max-width: 100vw;"
            :loading="isLoading"
            loading-text="Carregant dades..."
            >
            <template #item.actions="{ item }">
                <v-btn
                icon="mdi-delete"
                variant="text"
                color="error"
                @click="deleteStore(item)"
                ></v-btn>
            </template>
            </v-data-table-virtual>
            <v-divider></v-divider>
            <v-dialog v-model="showCreateStore" width="auto" >
                <CreateStoreDialog @closed="showCreateStore=false"/>
            </v-dialog>
            <v-card-actions>
                <v-btn @click="showCreateStore=true" icon="mdi-plus"></v-btn>
            </v-card-actions>
        </v-card>
    </v-container>
</template>

<script setup>
import { useAuthStore } from '@/stores/auth';
import CreateStoreDialog from '@/components/admin-panel/inventory-panel/items/CreateStoreDialog.vue';
import { ref, computed } from 'vue';


const auth = useAuthStore()
const stores = computed(() => auth.fallaAdminInfo?.stores || []) 
const isLoading = ref(false)

const showCreateStore = ref(false)

const deleteStore = async (item) => {
    if(confirm(`Estàs segur que vols eliminar el magatzem "${item.name}"?`)) {
        try {
            isLoading.value = true
            await auth.deleteInventoryStore(item.id)
        } catch(err) {
            console.error(err)
        } finally {
            isLoading.value = false
        }
    }
}

const headers = [
    {
        title:"Nom",
        key:"name",
        align:"center",
        cellProps: {
            class:"bg-primary"
        },
        headerProps: {
            class: "bg-ternary font-weight-bold"
        }
    },
    {
        title:"Ubicació",
        key:"location",
        align:"center",
        cellProps: {
            class:"bg-primary"
        },
        headerProps: {
            class: "bg-ternary font-weight-bold"
        }
    },
    {
        title:"Elimina",
        key:"actions",
        sortable:false,
        align:"end",
        cellProps: {
            class:"bg-primary"
        },
        headerProps: {
            class: "bg-ternary font-weight-bold"
        }
    }
]
</script>