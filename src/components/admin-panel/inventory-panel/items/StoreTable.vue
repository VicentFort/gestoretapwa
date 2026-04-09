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
                <v-dialog v-model="showDisableDialog" width="auto">
                    <v-container>
                        <v-card class="bg-primary">
                            <v-card-title class="bg-ternary text-primary font-weight-bold">
                                Vols deshabilitar el magatzem: {{ item.name }}
                            </v-card-title>
                            <v-card-text class="bg-primary text-primary">
                                Aquesta acció es irreversible
                            </v-card-text>
                            <v-card-options>
                                <v-btn class="bg-ternary" icon="mdi-cancel" @click="showDisableDialog=false"></v-btn>
                                <v-btn class="bg-ternary" @click="disableStore(item)">Deshabilita</v-btn>
                            </v-card-options>
                        </v-card>
                    </v-container>
                </v-dialog>
                <v-btn
                icon="mdi-file-edit"
                variant="text"
                color="ternary"
                @click="selectedStore=item; showEditStore=true"
                >
                </v-btn>
                <v-btn
                icon="mdi-delete"
                variant="text"
                color="error"
                @click="showDisableDialog=true"
                ></v-btn>
                
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


const auth = useAuthStore()
const showEditStore = ref(false)
const stores = computed(() => auth.fallaAdminInfo?.stores.filter(store => {
    return store.enabled==true
}) || []) 
const isLoading = ref(false)
const selectedStore = ref(null)
const showCreateStore = ref(false)
const showDisableDialog = ref(false)

const showErr = ref(false)
const error = ref('')

const disableStore = async (item) => {
    
    try {
        isLoading.value = true
        const updatedStore = {
            storeId: item.id,
            enabled: false,
        }
        await auth.updateStore(updatedStore)
        showDisableDialog.value = false
    } catch(err) {
        error.value = err
        showErr.value = true
    } finally {
        isLoading.value = false
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