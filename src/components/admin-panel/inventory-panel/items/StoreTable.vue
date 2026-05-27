<template>
    <v-container>
        <v-card flat title="Magatzems">
            <v-data-table-virtual 
            :items="stores"
            :headers="headers"
            hide-default-footer
            class="bg-primary elevation-1"
            style="max-width: 100vw;"
            :loading="isLoading"
            :sort-by="initialSort"
            loading-text="Carregant dades..."
            no-data-text="Sense magatzems"
            >
            <template #item="{item}">
                <tr class="responsive-tr">
                    <td class="responsive-td" data-label="Nom">
                        {{ item.name }}
                    </td>
                    <td class="responsive-td" data-label="Ubicació">
                        {{ item.location }}
                    </td>
                    <td class="responsive-td" data-label="Accions">
                        <v-btn
                        icon="mdi-file-edit"
                        variant="text"
                        color="ternary"
                        @click="selectedStore=item; showEditStore=true"
                        />
                    </td>
                </tr>
            </template>
            </v-data-table-virtual>
            <v-divider></v-divider>
            <v-dialog v-model="showCreateStore" width="auto" >
                <CreateStoreDialog @closed="showCreateStore=false"/>
            </v-dialog>
            <v-divider/>
            <v-dialog v-model="showEditStore" width="auto">
                <EditStoreDialog :store="selectedStore" @closed="showEditStore=false"/>
            </v-dialog>
            <v-card-actions>
                <v-btn @click="showCreateStore=true" icon="mdi-plus"></v-btn>
            </v-card-actions>
        </v-card>
    </v-container>
    <ErrorDialog @closed="showErr=false" :message="error" v-model="showErr"/>
</template>

<script setup>
import { useAuthStore } from '@/stores/auth';
import CreateStoreDialog from '@/components/admin-panel/inventory-panel/items/CreateStoreDialog.vue';
import { ref, computed } from 'vue';
import EditStoreDialog from '@/components/admin-panel/inventory-panel/items/EditStoreDialog.vue';
import ErrorDialog from '@/components/ErrorDialog.vue';

const auth = useAuthStore()
const showEditStore = ref(false)
const stores = computed(() => auth.fallaAdminInfo?.stores.filter(store => {
    return store.enabled==true
}) || []) 
const isLoading = ref(false)
const selectedStore = ref(null)
const showCreateStore = ref(false)

const showErr = ref(false)
const error = ref('')

const initialSort = ref([{key:'location', sort:'desc'}])

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
        title:"Accions",
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
    align-items: center !important;
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