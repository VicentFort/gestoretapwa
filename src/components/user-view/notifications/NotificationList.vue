<template>
  <v-container class="overflow-y-auto max-h-100">
    <v-card>
      <v-data-table-virtual
        hide-default-footer
        :items="displayNotifications"
        :headers="headers"
        hide-details
        hide-no-data
        single-line
        :class="xs ? 'bg-secondary' : 'bg-background'"
      >
        <template #item.date="{ item }">
          {{ formattedDateTime(item.date) }}
        </template>
        <template #item.actions="{ item }">
          <v-btn
            icon="mdi-check"
            color="transaction"
            :disabled="item.read == true"
            @click="readNotification(item)"
          />
        </template>
        <template #item="{ item }">
          <tr class="responsive-tr">
            <td class="responsive-td" data-label="Data">
              {{ formattedDateTime(item.date) }}
            </td>
            <td class="responsive-td" data-label="Missatge">
              {{ item.message }}
            </td>
            <td class="responsive-td" data-label="Accions">
              <div class="justify-center align-center d-flex">
                <v-btn
                  icon="mdi-check"
                  color="transaction"
                  :disabled="item.read == true"
                  @click="readNotification(item)"
                />
              </div>
            </td>
            <td class="responsive-td" data-label="Data">{{ item.falla }}</td>
          </tr>
        </template>
      </v-data-table-virtual>
      <v-card-actions class="justify-left">
        <v-spacer />
        <v-btn @click="emit('closed')" icon="mdi-cancel" />
      </v-card-actions>
    </v-card>
  </v-container>
  <ErrorDialog
    @closed="showErrorDiag = false"
    :message="error"
    v-model="showErrorDiag"
  />
</template>

<script setup>
import { useAuthStore } from "@/stores/auth";
import { formattedDateTime } from "@/stores/util";
import { computed, ref } from "vue";
import ErrorDialog from "@/components/ErrorDialog.vue";
import { useDisplay } from "vuetify/lib/composables/display";

const { xs } = useDisplay();

const auth = useAuthStore();
const emit = defineEmits(["closed"]);
const error = ref("");
const showErrorDiag = ref(false);
const showAll = ref(false);
const notifications = computed(() => auth.userInfo.notifications || []);
const displayNotifications = computed(() => {
  const sorted = [...notifications.value]
    .sort((a, b) => {
      return new Date(b.date) - Date(a.date);
    })
    .sort((a, b) => {
      return a.read == b.read;
    });
  return sorted;
});

const readNotification = async (notification) => {
  try {
    await auth.readNotification(new Number(notification.id));
  } catch (err) {
    error.value = err;
    showErrorDiag.value = true;
  }
};

const headers = [
  {
    title: "Data",
    value: "date",
    align: "center",
    sortable: true,
    cellProps: {
      class: "",
    },
    headerProps: {
      class: " font-weight-bold bg-secondary",
    },
  },
  {
    title: "Missatge",
    value: "message",
    align: "center",
    sortable: true,
    cellProps: {
      class: "",
    },
    headerProps: {
      class: " font-weight-bold bg-secondary",
    },
  },
  {
    title: "Accions",
    value: "actions",
    align: "center",
    sortable: true,
    cellProps: {
      class: "",
    },
    headerProps: {
      class: " font-weight-bold bg-secondary",
    },
  },
  {
    title: "Falla",
    value: "falla",
    align: "center",
    sortable: true,
    cellProps: {
      class: "",
    },
    headerProps: {
      class: " font-weight-bold bg-secondary",
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
    border-bottom: 8px solid rgb(var(--v-theme-secondary));
    height: auto !important;
    margin-bottom: 10px;
    background-color: rgb(var(--v-theme-secondary)) !important;
  }

  .responsive-td {
    display: flex;
    justify-content: space-between;
    align-items: center !important;
    border: none !important;
    padding: 8px 0 !important;
    gap: 10px;
    min-height: 40px;
    background-color: rgb(var(--v-theme-background)) !important;
    color: rgb(var(--v-theme-secondary));
  }

  .responsive-td::before {
    content: attr(data-label);
    font-weight: bold;
    text-transform: uppercase;
    font-size: 0.7rem;
    color: rgb(var(--v-theme-secondary));
  }
}
</style>
