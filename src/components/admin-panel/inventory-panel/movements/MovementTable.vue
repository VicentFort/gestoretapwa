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
            :items="inventoryMovements"
            hide-default-footer
            :headers="headers"
            :density="compact"
            :search="search"
            class="bg-ternary elevation-1"
            style="max-width: 100vw;">
                
            </v-data-table-virtual>
            <v-card-actions>
                <v-btn variant="text" icon="mdi-plus" @click="showAddMovement=true"></v-btn>
            </v-card-actions>
        </v-card>
    </v-container>
    <v-dialog v-model="showAddMovement">
        <AddMovementDialog @closed="showAddMovement=false"/>
    </v-dialog>
</template>

<script setup>
import { useAuthStore } from '@/stores/auth';
import { computed, ref } from 'vue';
import AddMovementDialog from '@/components/admin-panel/inventory-panel/movements/AddMovementDialog.vue';

const auth = useAuthStore()
const inventoryMovements = computed(() => auth.fallaAdminInfo?.inventoryMovements || []) 

const search=ref('')

const showAddMovement = ref(false)

const headers = [
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
        title:"Data del moviment",
        align:"center",
        value:"date",
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