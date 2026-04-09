<template>
    <v-container>
        <v-card flat
            title="Moviments d'inventari">
            
            <template v-slot:text>
                <v-text-field
                v-model="search"
                label="Busca"
                prepend-inner-icon="mdi-magnify"
                variant="outlined"
                hide-details
                single-line
                class="bg-primary">

                </v-text-field>
            </template>
            <v-data-table-virtual 
            :items="displayedMovements"
            item-value="id"
            hide-default-footer
            :headers="headers"
            :density="compact"
            :search="search"
            :sort-by="initialSort"
            class="bg-ternary elevation-1"
            style="max-width: 100vw;">
                <template #item.date="{ item }">
                  {{ item.date ? formattedDate(item.date) : 'Cargando...' }}
                </template>
            </v-data-table-virtual>
            <v-card-actions>
                <v-btn 
                v-if="inventoryMovements.length > 5" 
                class="justify-center"
                variant="text" 
                :icon="showAllMovements ? 'mdi-filter':  'mdi-clock-outline'"
                color="primary" 
                @click="showAllMovements = !showAllMovements"
                />
                {{ showAllMovements ? 'Mostrant només els primers 100' : `Mostrant tots (${inventoryMovements.length})` }}
                <v-btn variant="text" icon="mdi-plus" @click="showAddMovement=true"></v-btn>
            </v-card-actions>
        </v-card>
    </v-container>
    <v-dialog v-model="showAddMovement" scrollable max-width="600px">
        <AddMovementDialog @closed="showAddMovement=false"/>
    </v-dialog>
</template>

<script setup>
import { useAuthStore } from '@/stores/auth';
import { computed, ref } from 'vue';
import AddMovementDialog from '@/components/admin-panel/inventory-panel/movements/AddMovementDialog.vue';

const auth = useAuthStore()
const inventoryMovements = computed(() => auth.fallaAdminInfo?.inventoryMovements || []) 
const showAllMovements = ref(false)
const displayedMovements = computed(() => {
  if (showAllMovements.value==true) {
    return inventoryMovements.value
  }
  return inventoryMovements.value.slice(0, 5)
})
const search=ref('')

const showAddMovement = ref(false)

const initialSort = [{key: 'date', order:'desc'}]

const formattedDate = (dateString) => {
  if (!dateString) return ''
  
  const date = new Date(dateString)
  
  const day = String(date.getDate()).padStart(2, '0')
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const year = date.getFullYear()
  
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  const seconds = String(date.getSeconds()).padStart(2, '0')
  
  return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`
}
const headers = [
    {
        title:"Data del moviment",
        align:"center",
        value:"date",
        sortable:true,
        cellProps: {
            class:"bg-primary"
        },
        headerProps: {
            class:"bg-ternary font-weight-bold"
        }
    },
    {
        title:"Item",
        align:"center",
        sortable:"true",
        value:"itemName",
        cellProps: {
            class:"bg-primary"
        },
        headerProps: {
            class:"bg-ternary font-weight-bold"
        }
    },
    {
        title:"Magatzem",
        align:"center",
        sortable:"true",
        value:"storeName",
        cellProps: {
            class:"bg-primary"
        },
        headerProps: {
            class:"bg-ternary font-weight-bold"
        }
    },
    {
        title:"Quantitat",
        align:"center",
        value:"amount",
        cellProps: {
            class:"bg-primary"
        },
        headerProps: {
            class:"bg-ternary font-weight-bold"
        }
    },

    {
        title:"Tipus",
        align:"center",
        sortable:"true",
        value:"movementType",
        cellProps: {
            class:"bg-primary"
        },
        headerProps: {
            class:"bg-ternary font-weight-bold"
        }
    },
    {
        title:"Missatge",
        align:"center",
        value:"message",
        cellProps: {
            class:"bg-primary"
        },
        headerProps: {
            class:"bg-ternary font-weight-bold"
        }
    },
    {
        title:"Creat per",
        align:"center",
        value:"createdBy",
        cellProps: {
            class:"bg-primary"
        },
        headerProps: {
            class:"bg-ternary font-weight-bold"
        }
    }
]
</script>