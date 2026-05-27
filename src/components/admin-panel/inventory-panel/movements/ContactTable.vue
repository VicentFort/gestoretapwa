<template>
    <v-container>
        <v-card flat title="Contactes">
           <v-data-table-virtual 
            :items="contacts" 
            item-value="id"
            hide-default-footer="true" 
            :headers="headers"
            :density="compact"
            class="bg-primary elevation-1"
            no-data-text="Sense contactes"
            style="max-width: 100vw;"
            >
                <template #item.actions="{ item }">
                    <v-btn icon="mdi-file-edit" color="ternary" variant="text" @click="showUpdateContact=true; selectedContact=item"></v-btn>
                </template>
            </v-data-table-virtual>
            <v-card-actions>
                <v-btn variant="text" icon="mdi-plus"@click="showAddContact=true"></v-btn>
            </v-card-actions>
        </v-card>
    </v-container>
    <v-dialog v-model="showAddContact">
        <AddContact @closed="showAddContact=false"/>
    </v-dialog>
    <v-dialog v-model="showUpdateContact">
        <UpdateContactDialog :contact="selectedContact" @closed="showUpdateContact=false"/>
    </v-dialog>
</template>

<script setup>
import { useAuthStore } from '@/stores/auth';
import { ref, computed } from 'vue';
import AddContact from './AddContact.vue';
import UpdateContactDialog from './UpdateContactDialog.vue';


const auth = useAuthStore()
const contacts = computed(() => auth.fallaAdminInfo?.contacts || [])

const showUpdateContact = ref(false)
const showAddContact = ref(false)
const selectedContact = ref(null)


const headers = [
    {
        title:"Nom",
        value:"name",
        align:"center",
        sortable:true,
        cellProps: {
            class:"bg-primary"
        }, 
        headerProps: {
            class:"bg-ternary font-weight-bold text-primary"
        }
    },
    {
        title:"Correu electrònic",
        value:"email",
        align:"center",
        sortable:true,
        cellProps: {
            class:"bg-primary"
        }, 
        headerProps: {
            class:"bg-ternary font-weight-bold text-primary"
        }
    },
    {
        title:"Teléfon",
        value:"phone",
        align:"center",
        sortable:true,
        cellProps: {
            class:"bg-primary"
        }, 
        headerProps: {
            class:"bg-ternary font-weight-bold text-primary"
        }
    },
    {
        title:"DNI / CIF",
        value:"dniCif",
        align:"center",
        sortable:true,
        cellProps: {
            class:"bg-primary"
        }, 
        headerProps: {
            class:"bg-ternary font-weight-bold text-primary"
        }
    }, 
    {
        title:"Accions",
        key:"actions",
        align:"center",
        cellProps: {
            class:"bg-primary"
        }, 
        headerProps: {
            class:"bg-ternary font-weight-bold text-primary"
        }
    }

]

</script>