<template>
    <v-container>
        <v-card>
            <v-data-table-virtual 
            :items="inventoryItems" 
            hide-default-footer="true" 
            :headers="headers"
            :density="compact"
            class="bg-ternary elevation-1"
            style="max-width: 100vw;"
            >
            <template #item.actions="{ item }">
                <v-btn
                icon="mdi-delete"
                variant="text"
                color="error"
                @click="deleteItem(item)"
                ></v-btn>
            </template>
            </v-data-table-virtual>
            <v-divider></v-divider>
            <v-dialog v-model="showCreateItem" width="auto">
                <CreateItemDialog @closed="showCreateItem=false"/>
            </v-dialog>
            <v-card-actions>
                <v-btn @click="showCreateItem=true" icon="mdi-plus"></v-btn>
            </v-card-actions>
        </v-card>
    </v-container>
</template>

<script setup>
import { useAuthStore } from '@/stores/auth';
import { ref, computed } from 'vue';
import CreateItemDialog from '@/components/admin-panel/inventory-panel/items/CreateItemDialog.vue';


const auth = useAuthStore()

const showCreateItem = ref(false)
const inventoryItems = computed(() => auth.fallaAdminInfo?.inventoryItems || []) 



const headers = [
     {  
        title: "Categoría", 
        align:"center",
        value: "category",
        cellProps: {
            class:"bg-primary"
        },
        headerProps: {
            class:"bg-ternary font-weight-bold"
        }

     },
     {
        title: "Nom", 
        align:"center", 
        value: "name",
         cellProps: {
            class:"bg-primary"
        },
        headerProps: {
            class:"bg-ternary font-weight-bold"
        }
     },
     {
        title: "Descripció", 
        align:"center",  
        value:"description",
         cellProps: {
            class:"bg-primary"
        },
        headerProps: {
            class:"bg-ternary font-weight-bold"
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

const deleteItem = async (item) => {
    if(confirm(`Estàs segur que vols eliminar el item "${item.name}"?`)) {
        try {
            await auth.deleteInventoryItem(item.id)
        } catch(err) {
            console.error(err)
        } finally {
        }
    }
}

</script>

