<template>
    <v-container>
        <v-card flat title="Items">
            <v-data-table-virtual 
            :items="inventoryItems" 
            item-value="id"
            hide-default-footer="true" 
            :headers="headers"
            :density="compact"
            class="bg-ternary elevation-1"
            style="max-width: 100vw;"
            >
            <template #item.actions="{ item }">
                <v-dialog v-model="showDisableDialog" width="auto">
                    <v-container>
                        <v-card class="bg-primary">
                            <v-card-title class="bg-ternary text-primary font-weight-bold">
                                Vols deshabilitar el item: {{ item.name }}
                            </v-card-title>
                            <v-card-text class="bg-primary text-primary">
                                Aquesta acció es irreversible
                            </v-card-text>
                            <v-card-options>
                                <v-btn class="bg-ternary" icon="mdi-cancel" @click="showDisableDialog=false"></v-btn>
                                <v-btn class="bg-ternary" @click="disableItem(item)">Deshabilita</v-btn>
                            </v-card-options>
                        </v-card>
                    </v-container>
                </v-dialog>
                <v-btn
                icon="mdi-file-edit"
                variant="text"
                color="ternary"
                @click="selectedItem=item; showEditItem=true"
                >
                </v-btn>
                <v-btn
                icon="mdi-delete"
                variant="text"
                color="error"
                @click="showDisableDialog=true"
                ></v-btn>
            </template>
            <template #item.storeName="{ item }">
                <div v-for="(stock, index) in item.stocks" :key="index" class="bg-primary">
                    {{ stock.storeName }}
                </div>
            </template>
            <template #item.amount="{ item }">
                <div v-for="(stock, index) in item.stocks" :key="index" class="py-1 bg-primary">
                    <v-chip size="small">{{ stock.amount }}</v-chip>
                </div>
            </template>
            </v-data-table-virtual>
            <v-divider></v-divider>
            <v-dialog v-model="showCreateItem" width="auto">
                <CreateItemDialog @closed="showCreateItem=false"/>
            </v-dialog>
            <v-dialog v-model="showEditItem" width="auto">
                <EditItemDialog :item="selectedItem" @closed="showEditItem=false"/>
            </v-dialog>
            <v-card-actions>
                <v-btn @click="showCreateItem=true" icon="mdi-plus"></v-btn>
            </v-card-actions>
        </v-card>
    </v-container>
    <ErrorDialog @closed="showErr=false" :message="error" v-model="showErr"/>
</template>

<script setup>
import { useAuthStore } from '@/stores/auth';
import { ref, computed } from 'vue';
import CreateItemDialog from '@/components/admin-panel/inventory-panel/items/CreateItemDialog.vue';
import EditItemDialog from '@/components/admin-panel/inventory-panel/items/EditItemDialog.vue';


const auth = useAuthStore()

const showCreateItem = ref(false)
const showEditItem = ref(false)

const selectedItem = ref(null)

const showErr = ref(false)
const error = ref('')

const inventoryItems = computed(() => auth.fallaAdminInfo?.inventoryItems.filter(item=> {
    return item.enabled==true
}) || []) 

const showDisableDialog = ref(false)

const disableItem = async (item) => {
    try {
        const updatedItem = {
            itemId: item.id,
            enabled: false
        }
        await auth.updateInventoryItem(updatedItem)
        showDisableDialog.value = false
    } catch(err) {
        error.value = err
        showErr.value=true
    }

}

const headers = [
    
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
        title:"Stocks",
        align:"center",
        children: [
            {title:"Magatzem", key:"storeName"},
            {title:"Quantitat", key:"amount"}
        ],
        children: [
        { 
            title: "Magatzem", 
            key: "storeName", 
            align: "center",
            cellProps: { class: "bg-primary" }, 
            headerProps: { class: "bg-ternary font-weight-bold" }
        },
        { 
            title: "Quantitat", 
            key: "amount", 
            align: "center",
            cellProps: { class: "bg-primary" }, 
            headerProps: { class: "bg-ternary font-weight-bold" }
        },
        ],
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

