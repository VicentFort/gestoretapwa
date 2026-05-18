<template>
    <v-container>
        <v-card title="Items">
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
                    <v-btn
                    icon="mdi-file-edit"
                    variant="text"
                    color="ternary"
                    @click="selectedItem=item; showEditItem=true"
                    >
                    </v-btn>
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
                <template #item.category="{item}">
                    <v-icon
                    color="ternary"
                    :icon="returnCategoryIcon(item.category)"
                    />
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
import ErrorDialog from '@/components/ErrorDialog.vue';


const auth = useAuthStore()

const showCreateItem = ref(false)
const showEditItem = ref(false)

const selectedItem = ref(null)

const showErr = ref(false)
const error = ref('')

const inventoryItems = computed(() => auth.fallaAdminInfo?.inventoryItems.filter(item=> {
    return item.enabled==true
}) || []) 


const returnCategoryIcon = (category) => {
    console.log(category)
    switch(category){
        case 'Pirotècnia': return 'mdi-firework'
        case 'Menjar': return 'mdi-food-drumstick'
        case 'Oficiona': return 'mdi-chair-rolling'
        case 'Arts plàstiques': return 'mdi-palette'
        case 'Beguda': return 'mdi-beer'
        case 'Infraestructura': return 'mdi-domain'
        case 'Electrònica / Informàtica': return 'mdi-chip'
        default: return 'mdi-note'
    }
}

const headers = [
    
     {
        title: "Nom", 
        align:"center", 
        value: "name",
         cellProps: {
            class:"bg-primary",
            width:"10%"
        },
        headerProps: {
            class:"bg-ternary font-weight-bold"
        }
     },
     {
        title:"Accions",
        key:"actions",
        sortable:false,
        align:"end",
        cellProps: {
            class:"bg-primary",
            width:"10%"
        },
        headerProps: {
            class: "bg-ternary font-weight-bold"
        }
    },
     {
        title:"Stocks",
        align:"center",
        sortable:false,
        children: [
        { 
            title: "Magatzem", 
            sortable:false,
            key: "storeName", 
            align: "center",
            cellProps: { class: "bg-primary", width:"10%" }, 
            headerProps: { class: "bg-quaternary font-weight-bold" }
        },
        { 
            title: "Quantitat", 
            key: "amount", 
            align: "center",
            sortable:false,
            cellProps: { class: "bg-primary", width:"10%" }, 
            headerProps: { class: "bg-quaternary font-weight-bold" }
        },
        ],
        headerProps: {
            class:"bg-ternary font-weight-bold"
        }
     },
        {  
        title: "Categoría", 
        align:"center",
        value: "category",
        cellProps: {
            class:"bg-primary",
            width:"10%"
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
            class:"bg-primary",
            width:"20%"
        },
        headerProps: {
            class:"bg-ternary font-weight-bold"
        }
     }
    

]
</script>

