<template>
  <v-container>
    <v-card flat class="text-h6" title="Llistat de mebres">
      <v-btn icon="mdi-filter" @click="isFilterDiagOpen = true" class="ms-2" />
      <v-btn
        class="ms-2"
        icon="mdi-filter-remove"
        @click="users = null"
        :disabled="!users"
      />
      <v-data-table-virtual
        :items="orderedUsers"
        :headers="headers"
        class=""
        hide-default-footer
        no-data-text="No s'han trobat membres"
      >
        <template #item="{ item }">
          <tr class="responsive-tr">
            <td class="responsive-td" data-label="Nom">
              {{ item.name }} {{ item.surname }}
            </td>
            <td class="responsive-td" data-label="Accions">
              <div class="justify-center align-center d-flex">
                <v-btn
                  icon="mdi-plus"
                  variant="text"
                  @click="openUserDetails(item)"
                />
                <v-btn
                  icon="mdi-police-badge"
                  variant="text"
                  @click="editUserCharge(item)"
                  :disabled="!isSuperUser(auth.userInfo.accessType)"
                />
              </div>
            </td>
            <td class="responsive-td" data-label="Faller des de">
              {{ item.joinDate }}
            </td>
            <td class="responsive-td" data-label="Aniversari">
              {{ item.birthday }}
            </td>
            <td class="responsive-td" data-label="Càrrec">
              <v-icon :icon="getChargeIcon(item.accessType)" />
            </td>
          </tr>
        </template>
      </v-data-table-virtual>
      <v-divider></v-divider>

      <v-dialog v-model="isDetailsOpen" width="auto">
        <UserDetails v-model="isDetailsOpen" :user="selectedUser" />
      </v-dialog>
      <v-dialog v-model="isFilterDiagOpen" min-width="200px">
        <FilterUsersDialog
          @update-filter="handleFilter"
          @closed="isFilterDiagOpen = false"
        />
      </v-dialog>
      <v-dialog v-model="isEditChargeOpen" min-width="200px">
        <v-container>
          <v-card>
            <v-card-title class="text-h6">
              Vas a editar el càrrec de {{ selectedUser.fullName }}
            </v-card-title>
            <v-select
              v-if="auth.userInfo.accessType == 'Superusuari'"
              :items="accessTypes"
              v-model="localUser.accessType"
              label="Modificar el permís d'accés"
            >
            </v-select>
            <v-card-actions>
              <v-spacer />
              <v-btn
                @click="editAccessType()"
                icon="mdi-check"
                variant="text"
              />
              <v-btn
                @click="isEditChargeOpen = false"
                icon="mdi-cancel"
                variant="text"
              />
            </v-card-actions>
          </v-card>
        </v-container>
      </v-dialog>
    </v-card>
  </v-container>
</template>

<script setup>
import { useAuthStore } from "@/stores/auth";
import { ref, computed } from "vue";
import UserDetails from "./UserDetails.vue";
import { isSuperUser } from "@/stores/checkAccessType";
import { accessTypes } from "@/stores/backendEnums";
import FilterUsersDialog from "./FilterUsersDialog.vue";
const auth = useAuthStore();
const users = ref(null);

const orderedUsers = computed(() => {
  let base = users.value
    ? [...users.value]
    : [...(auth.fallaAdminInfo?.users || [])];

  if (!base.length) return [];

  return base.sort((a, b) => {
    const nameA = a.name || "";
    const nameB = b.name || "";
    return nameA.localeCompare(nameB);
  });
});
const getChargeIcon = (aType) => {
  if (aType == accessTypes[0]) return "mdi-account";
  if (aType == accessTypes[1]) return "mdi-account-child";
  if (aType == accessTypes[2]) return "mdi-account-star";
  if (aType == accessTypes[3]) return "mdi-account-key";
  return "mdi-account-cancel";
};

const handleFilter = (list) => {
  users.value = list;
  isFilterDiagOpen.value = false;
};

const selectedUser = ref(null);
const localUser = ref({ ...selectedUser.value });
const isDetailsOpen = ref(false);
const isEditChargeOpen = ref(false);
const isFilterDiagOpen = ref(false);
const editAccessType = async () => {
  try {
    const accessRequest = {
      accessType: localUser.value.accessType,
      userId: selectedUser.value.id,
    };
    await auth.editAccessType(accessRequest);
    isEditChargeOpen.value = false;
  } catch (err) {
    error.value = err;
    showErrorDiag.value = true;
  }
};

const openUserDetails = (user) => {
  isEditChargeOpen.value = false;
  selectedUser.value = user;
  isDetailsOpen.value = true;
};

const editUserCharge = (user) => {
  isDetailsOpen.value = false;
  selectedUser.value = user;
  isEditChargeOpen.value = true;
};

const headers = [
  {
    title: "Nom",
    align: "center",
    value: "fullName",
    sortable: true,
    cellProps: {
      class: "",
    },
    headerProps: {
      class: " font-weight-bold",
    },
  },
  {
    title: "Accions",
    align: "center",
    value: "actions",
    sortable: true,
    cellProps: {
      class: "",
    },
    headerProps: {
      class: " font-weight-bold",
    },
  },
  {
    title: "Faller des de",
    align: "center",
    value: "joinDate",
    sortable: true,
    cellProps: {
      class: "",
    },
    headerProps: {
      class: " font-weight-bold",
    },
  },
  {
    title: "Aniversari",
    align: "center",
    value: "birthday",
    sortable: true,
    cellProps: {
      class: "",
    },
    headerProps: {
      class: " font-weight-bold",
    },
  },
  {
    title: "Càrrec",
    align: "center",
    value: "accessType",
    sortable: true,
    cellProps: {
      class: "",
    },
    headerProps: {
      class: " font-weight-bold",
    },
  },
];
</script>
<style scoped>
@media (max-width: 600px) {
  :deep(thead) {
    display: none;
  }

  .responsive-tr {
    display: flex;
    flex-direction: column;
    padding: 12px;
    border-bottom: 8px solid #eeeeee;
    height: auto !important;
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
