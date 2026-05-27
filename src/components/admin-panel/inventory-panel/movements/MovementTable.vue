<template>
  <v-container>
    <v-card flat title="Moviments d'inventari">
      
      <template v-slot:text>
        <v-text-field
          v-model="search"
          label="Busca"
          prepend-inner-icon="mdi-magnify"
          variant="outlined"
          hide-details
          single-line
          class="bg-primary"
        />
      </template>
      <v-card-actions>
        <v-btn 
          v-if="inventoryMovements.length > 25" 
          variant="text" 
          :icon="showAllMovements ? 'mdi-filter': 'mdi-clock-outline'"
          color="primary" 
          @click="showAllMovements = !showAllMovements"
        />
        <span class="text-caption">
            {{ !showAllMovements 
                ? `Mostrant només els primers ${xs ? 5 : 25}` 
                : `Mostrant tots (${inventoryMovements.length})` 
            }}
        </span>
        <v-spacer />
        <v-btn variant="text" icon="mdi-plus" @click="showAddMovement=true"></v-btn>
      </v-card-actions>
      <v-data-table-virtual
        :items="displayedMovements"
        item-value="id"
        hide-default-footer
        :headers="headers"
        :density="compact"
        :search="search"
        :sort-by="initialSort"
        no-data-text="Sense moviment d'inventari"
        class="bg-primary elevation-1 responsive-table"
        style="max-width: 100vw;"
      >
        <template #item="{ item }">
          <tr class="responsive-tr">
            <td class="responsive-td" data-label="Data">
              {{ item.date ? formattedDate(item.date) : 'Cargando...' }}
            </td>
            
            <td class="responsive-td" data-label="Tipus">
              <div class="justify-end align-center d-flex">
                
                <template v-if="item.movementType === 'Prèstec'">
                  <v-btn 
                    v-if="item.loan?.state === 'Pendent' || item.loan?.state === 'Atrassat'"
                    :class="returnButtonStyle(item.loan?.state)"
                    :icon="returnButtonIcon(item.loan?.state)"
                    size="small"
                    @click="showReturnDialog=true; selectedLoan=item.loan"
                  />
                  <v-icon 
                    v-else 
                    :color="item.loan?.state === 'Tornat' ? 'green' : 'error'"
                    :icon="returnButtonIcon(item.loan?.state)"
                  />
                </template>

                <v-icon 
                  v-else 
                  :icon="getMovementIcon(item.movementType)" 
                  :color="item.movementType === 'Entrada' ? 'success' : 'orange'"
                />
              </div>
            </td>

            <td class="responsive-td" data-label="Item">{{ item.itemName }}</td>
            <td class="responsive-td" data-label="Magatzem">{{ item.storeName }}</td>
            <td class="responsive-td" data-label="Quantitat">{{ item.amount }}</td>
            <td class="responsive-td" data-label="Missatge">{{ item.message }}</td>
            <td class="responsive-td" data-label="Creat per">{{ item.createdBy }}</td>
          </tr>
        </template>

      </v-data-table-virtual>

      
    </v-card>

    <v-dialog v-model="showAddMovement" scrollable max-width="600px">
        <AddMovementDialog @closed="showAddMovement=false" />
    </v-dialog>
    <v-dialog v-model="showReturnDialog">
        <ReturnDialog @closed="showReturnDialog=false" :loan="selectedLoan"/>
    </v-dialog>
  </v-container>
</template>

<script setup>
import { useAuthStore } from '@/stores/auth';
import { computed, ref } from 'vue';
import AddMovementDialog from '@/components/admin-panel/inventory-panel/movements/AddMovementDialog.vue';
import ReturnDialog from '@/components/admin-panel/inventory-panel/movements/ReturnDialog.vue';
import { useDisplay } from 'vuetify/lib/composables/display';

const { xs } = useDisplay()

const auth = useAuthStore()
const inventoryMovements = computed(() => auth.fallaAdminInfo?.inventoryMovements || []) 
const showAllMovements = ref(false)
const search = ref('')
const selectedLoan = ref(null)
const showAddMovement = ref(false)
const showReturnDialog = ref(false)
const initialSort = ref([{key: 'date', order:'desc'}])

const displayedMovements = computed(() => {
  // 1. Clonamos y ordenamos siempre por fecha
  const sorted = [...inventoryMovements.value].sort((a, b) => {
    return new Date(b.date) - new Date(a.date)
  })

  // 2. Si "Mostrar todos" está activo, no cortamos nada
  if (showAllMovements.value) {
    return sorted
  }

  // 3. Lógica de corte inteligente:
  // Si es móvil (xs), mostramos 5. Si es escritorio, mostramos 25.
  const limit = xs.value ? 5 : 25
  
  return sorted.slice(0, limit)
})

// --- LÓGICA DE ICONOS ---

const getMovementIcon = (type) => {
    if (type === 'Entrada') return 'mdi-arrow-down-bold-circle-outline'
    if (type === 'Eixida') return 'mdi-arrow-up-bold-circle-outline'
    return 'mdi-help'
}

const returnButtonStyle = (state) => {
    switch(state) {
        case "Tornat": return 'bg-green'
        case "Atrassat": return 'bg-error'
        default: return 'bg-ternary'
    }
}

const returnButtonIcon = (state) => {
    switch(state) {
        case "Tornat": return 'mdi-check-all'
        case "Atrassat": return 'mdi-clock-alert'
        default: return 'mdi-keyboard-return' // Este es el que invita a interactuar
    }
}

const formattedDate = (dateString) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleString('es-ES') // Simplificado para el ejemplo
}

const headers = [
    {
        title:"Data del moviment",
        align:"center",
        key:"date",
        sortable:true,
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
        key:"movementType",
        sort: (a,b) => {
            const priority = { "Entrada": 1, "Eixida": 2, "Prèstec": 3}
            return priority[a] - priority[b]
        },
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
        sortable: true,
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
    }, 
    
]
</script>

<style scoped>
@media (max-width: 600px) {
  :deep(thead) { display: none; }

  .responsive-tr {
    display: flex;
    flex-direction: column;
    padding: 12px;
    border-bottom: 8px solid #eeeeee;
    height: auto !important;
    background-color: white;
    margin-bottom: 8px;
  }

  .responsive-td {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border: none !important;
    padding: 8px 0 !important;
    min-height: 40px;
  }

  .responsive-td::before {
    content: attr(data-label);
    font-weight: bold;
    text-transform: uppercase;
    font-size: 0.7rem;
    color: #757575;
  }
}
</style>