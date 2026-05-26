<template>
    <v-container>
        <v-card class="bg-primary">
            <v-card-title class='bg-ternary'>
                Llistat de membres
            </v-card-title>
            
            <v-data-table-virtual
            :items="orderedUsers"
            :headers="headers"
            hide-default-footer
            >
                <template #item.actions="{item}">
                    <v-btn icon="mdi-plus" variant="text" color="ternary" @click="openUserDetails(item)"/>
                    <v-btn icon="mdi-police-badge" variant="text" color="ternary" @click="editUserCharge(item)" :disabled="!isSuperUser(auth.userInfo.accessType)"/>
                </template>
            </v-data-table-virtual>
            <v-divider></v-divider>


            <v-dialog v-model="isDetailsOpen" width="auto">
                <UserDetails v-model="isDetailsOpen" :user="selectedUser"/>
            </v-dialog>
            <v-dialog v-model="isEditChargeOpen" min-width="200px">
                <v-container>
                    <v-card class="bg-primary">
                        <v-card-title class="bg-ternary"> Vas a editar el càrrec de {{ selectedUser.fullName }} </v-card-title>
                        <v-select v-if="auth.userInfo.accessType=='Superusuari'"
                        :items="accessTypes"
                        v-model="selectedUser.accessType"
                        label="Modificar el permís d'accés">
                        </v-select>
                        <v-card-actions>
                            <v-btn @click="isEditChargeOpen=false" icon="mdi-cancel" color="ternary" variant="text"/>
                            <v-btn @click="editAccessType()" icon="mdi-check" color="ternary" variant="text"/>
                        </v-card-actions>
                    </v-card>
                </v-container>
                
            </v-dialog>
        </v-card>
    </v-container>
</template>

<script setup>
import { useAuthStore } from '@/stores/auth';
import { ref, computed } from 'vue';
import UserDetails from './UserDetails.vue';
import { isSuperUser } from '@/stores/checkAccessType';
import { accessTypes } from '@/stores/backendEnums';

const auth = useAuthStore()
const users = ref(null)

const search = ref('')
const orderedUsers = computed(() => {
    let base = users.value 
        ? [...users.value] 
        : [...(auth.fallaAdminInfo?.users || [])];

    if (!base.length) return [];

    return base.sort((a, b) => {
        const nameA = a.name || '';
        const nameB = b.name || '';
        return nameA.localeCompare(nameB);
    });
})
const selectedUser = ref(null)
const isDetailsOpen = ref(false)
const isEditChargeOpen = ref(false)
const editAccessType = async () => {
    try {
        const accessRequest = {
            accessType: selectedUser.value.accessType,
            userId: selectedUser.value.id
        }
        await auth.editAccessType(accessRequest)
        isEditChargeOpen.value = false
    } catch(err) {
        error.value=err
        showErrorDiag.value = true
    }

}

const openUserDetails = (user) => {
    isEditChargeOpen.value = false
    selectedUser.value = user
    isDetailsOpen.value = true
}

const editUserCharge = (user) => {
    isDetailsOpen.value=false
    selectedUser.value = user
    isEditChargeOpen.value = true
}

const headers = [
    {
        title: 'Nom',
        align: 'center',
        value: 'fullName',
        sortable: true,
        cellProps: {
            class:"bg-primary"
        },
        headerProps: {
            class:"bg-ternary font-weight-bold"
        }
    },
    {
        title: 'Accions',
        align: 'center',
        value: 'actions',
        sortable: true,
        cellProps: {
            class:"bg-primary"
        },
        headerProps: {
            class:"bg-ternary font-weight-bold"
        }
    },
    {
        title: 'Faller des de',
        align: 'center',
        value: 'joinDate',
        sortable: true,
        cellProps: {
            class:"bg-primary"
        },
        headerProps: {
            class:"bg-ternary font-weight-bold"
        }
    },
    {
        title: 'Aniversari',
        align: 'center',
        value: 'birthday',
        sortable: true,
        cellProps: {
            class:"bg-primary"
        },
        headerProps: {
            class:"bg-ternary font-weight-bold"
        }
    },
    {
        title: 'Càrrec',
        align: 'center',
        value: 'accessType',
        sortable: true,
        cellProps: {
            class:"bg-primary"
        },
        headerProps: {
            class:"bg-ternary font-weight-bold"
        }
    },
]
</script>