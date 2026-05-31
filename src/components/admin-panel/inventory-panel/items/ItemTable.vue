<template>
  <v-container>
    <v-card title="Items" class="text-h6">
      <v-btn icon="mdi-filter" @click="isFilterDiagOpen = true" class="ms-2" />

      <v-btn
        class="ms-2"
        icon="mdi-filter-remove"
        @click="filteredItems = null"
        :disabled="!filteredItems"
      />


      <v-btn
          v-if="inventoryItems.length > 10 && !filteredItems"
          variant="text"
          :icon="showAllItems ? 'mdi-filter' : 'mdi-clock-outline'"
          @click="showAllItems = !showAllItems"
        />
      <span class="text-caption" v-if="!filteredItems">
        {{
          !showAllItems
            ? `Mostrant només els primers ${xs ? 5 : 10}`
            : `Mostrant tots (${inventoryItems.length})`
        }}
      </span>
      <v-btn @click="showCreateItem = true" icon="mdi-plus" class="ms-2" />

      <v-data-table-virtual
        :items="displayedItems"
        item-value="id"
        hide-default-footer="true"
        :sort-by="initialSort"
        :headers="headers"
        class="elevation-1"
        style="max-width: 100vw"
        no-data-text="Sense item de inventari"
      >
        <template #item="{ item }">
          <tr class="responsive-tr">
            <td class="responsive-td" data-label="Nom">{{ item.name }}</td>
            <td class="responsive-td" data-label="Accions">
              <div class="justify-center align-center d-flex">
                <v-btn
                  icon="mdi-file-edit"
                  variant="text"
                  @click="
                    selectedItem = item;
                    showEditItem = true;
                  "
                />
                <v-btn
                  icon="mdi-warehouse"
                  variant="text"
                  @click="
                    selectedItemForStocks = item;
                    showItemStocks = true;
                  "
                />
              </div>
            </td>
            <td class="responsive-td" data-label="Categoria">
              <div class="justify-center align-center d-flex">
                <v-icon :icon="returnCategoryIcon(item.category)" />
              </div>
            </td>

            <td class="responsive-td" data-label="Descripció">
              {{ item.description }}
            </td>
          </tr>
        </template>
      </v-data-table-virtual>
      <v-divider></v-divider>
      <v-dialog v-model="showCreateItem" min-width="200px">
        <CreateItemDialog @closed="showCreateItem = false" />
      </v-dialog>
      <v-dialog v-model="showEditItem" min-width="200px">
        <EditItemDialog :item="selectedItem" @closed="showEditItem = false" />
      </v-dialog>
    </v-card>
  </v-container>
  <v-dialog v-model="showItemStocks" min-width="200px">
    <ItemStocksDialog
      :inv-item="selectedItemForStocks"
      @closed="showItemStocks = false"
    />
  </v-dialog>
  <v-dialog v-model="isFilterDiagOpen" min-width="200px">
    <ItemFilterDialog
      @update-filter="handleFilter"
      @closed="isFilterDiagOpen = false"
    />
  </v-dialog>
  <ErrorDialog @closed="showErr = false" :message="error" v-model="showErr" />
</template>

<script setup>
import { useAuthStore } from "@/stores/auth";
import { ref, computed } from "vue";
import CreateItemDialog from "@/components/admin-panel/inventory-panel/items/CreateItemDialog.vue";
import EditItemDialog from "@/components/admin-panel/inventory-panel/items/EditItemDialog.vue";
import ErrorDialog from "@/components/ErrorDialog.vue";
import ItemStocksDialog from "./ItemStocksDialog.vue";
import ItemFilterDialog from "./ItemFilterDialog.vue";
import { useDisplay } from "vuetify/lib/composables/display.js";

const auth = useAuthStore();
const {xs} = useDisplay()
const showCreateItem = ref(false);
const showEditItem = ref(false);
const showItemStocks = ref(false);

const selectedItem = ref(null);
const selectedItemForStocks = ref(null);

const showErr = ref(false);
const error = ref("");

const filteredItems = ref(null);
const isFilterDiagOpen = ref(false);
const showAllItems = ref(false)
const inventoryItems = computed(() => {
  const base = !filteredItems.value
    ? [...(auth.fallaAdminInfo?.inventoryItems || [])]
    : filteredItems.value;
  return (
    base.filter((item) => {
      return item.enabled == true;
    }) || []
  );
});

const displayedItems = computed(() => {
  const sorted = [...inventoryItems.value]

  if (showAllItems.value) {
    return sorted;
  }

  const limit = xs.value ? 5 : 10;

  return sorted.slice(0, limit);
});

const handleFilter = (list) => {
  filteredItems.value = list;
  isFilterDiagOpen.value = false;
};

const returnCategoryIcon = (category) => {
  switch (category) {
    case "Pirotècnia":
      return "mdi-firework";
    case "Menjar":
      return "mdi-food-drumstick";
    case "Oficiona":
      return "mdi-chair-rolling";
    case "Arts plàstiques":
      return "mdi-palette";
    case "Beguda":
      return "mdi-beer";
    case "Infraestructura":
      return "mdi-domain";
    case "Electrònica / Informàtica":
      return "mdi-chip";
    default:
      return "mdi-note";
  }
};

const initialSort = ref([{ key: "category", sort: "desc" }]);

const headers = [
  {
    title: "Nom",
    align: "center",
    sortable: true,
    value: "name",
    cellProps: {
      class: " justify-center",
      width: "10%",
    },
    headerProps: {
      class: " font-weight-bold",
    },
  },
  {
    title: "Accions",
    key: "actions",
    sortable: false,
    align: "end",
    cellProps: {
      class: "",
      width: "10%",
    },
    headerProps: {
      class: " font-weight-bold",
    },
  },

  {
    title: "Categoria",
    sortable: true,
    align: "center",
    value: "category",
    cellProps: {
      class: "",
      width: "10%",
    },
    headerProps: {
      class: " font-weight-bold",
    },
  },
  {
    title: "Descripció",
    align: "center",
    value: "description",
    cellProps: {
      class: "",
      width: "20%",
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
