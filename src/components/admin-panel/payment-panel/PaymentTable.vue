<template>
  <v-card>
    <v-col cols="12" md="6" class="justify-center" grow>
      <v-btn @click="registerPayment()" icon="mdi-plus" class="ms-2" />
      <v-btn @click="sellCoupon()" icon="mdi-currency-eur" class="ms-2" />
      <v-btn @click="exchangeCoupon()" icon="mdi-cash" class="ms-2" />
      <v-divider class="ms-2" />

      <v-btn @click="filterPayments()" icon="mdi-filter" class="ms-2" />
      <v-btn
        @click="filteredPayments = null"
        icon="mdi-filter-minus"
        :disabled="!filteredPayments"
        class="ms-2"
      />
      <v-divider class="ms-2"/>
      <v-btn
          v-if="payments.length > 10"
          variant="text"
          :icon="showAllPayments ? 'mdi-filter' : 'mdi-clock-outline'"
          @click="showAllPayments = !showAllPayments"
        />
      <span class="text-caption">
        {{
          !showAllPayments
            ? `Mostrant només els primers ${xs ? 5 : 10}`
            : `Mostrant tots (${payments.length})`
        }}
      </span>
    </v-col>
    <v-data-table-virtual
      :items="paymentsToShow"
      item-value="id"
      hide-default-footer
      class=""
      no-data-text="Sense pagaments"
      :sort-by="initialSort"
      :headers="headers"
      :key="paymentsToShow.length"
    >
      <template #item.actions="{ item }">
        <v-btn
          icon="mdi-information"
          variant="text"
          @click="showPaymentInfo(item)"
        />
      </template>
      <template #item.date="{ item }">
        {{ formattedDateTime(item.date) }}
      </template>
      <template #item="{ item }">
        <tr class="responsive-tr">
          <td class="responsive-td" data-label="Data">
            {{ item.date ? formattedDate(item.date) : "Cargando..." }}
          </td>

          <td class="responsive-td" data-label="Tipus">
            <div class="justify-end align-center d-flex">
              <v-icon :icon="getPTypeIcon(item.type)" color="success" />
            </div>
          </td>
          <td class="responsive-td" data-label="Accions">
            <v-btn
              icon="mdi-information"
              variant="text"
              @click="showPaymentInfo(item)"
            />
          </td>
          <td class="responsive-td" data-label="Import total">
            {{ item.displayPrice }}
          </td>
          <td class="responsive-td" data-label="Gestor">{{ item.manager }}</td>
        </tr>
      </template>
    </v-data-table-virtual>
    <v-divider />
  </v-card>
  <v-dialog v-model="showInfoDialog" min-width="200px">
    <PaymentDetails
      :payment="selectedPayment"
      @closed="
        showInfoDialog = false;
        selectedPayment = null;
      "
    />
  </v-dialog>
  <v-dialog v-model="showRegisterPaymentDialog" min-width="200px" grow>
    <RegisterPaymentDialog
      @closed="
        showRegisterPaymentDialog = false;
        filteredPayments = null;
      "
    />
  </v-dialog>
  <v-dialog v-model="showSellCouponDialog" min-width="200px" grow>
    <SellCouponDialog @closed="showSellCouponDialog=false;
    filteredPayments=null""/>
  </v-dialog>
  <v-dialog v-model="showExchangeCouponDialog" min-width="200px">
    <ExchangeCouponDialog @closed="showExchangeCouponDialog=false;
    filteredPayments=null""/>
  </v-dialog>
  <v-dialog v-model="showFilterDialog" min-width="200px">
    <FilterPaymentsDialog
      @update-filter="handleFilter"
      @closed="showFilterDialog = false"
    />
  </v-dialog>
</template>

<script setup>
import { useAuthStore } from "@/stores/auth";
import { computed, ref } from "vue";
import PaymentDetails from "./PaymentDetails.vue";
import { formattedDateTime } from "@/stores/util";
import RegisterPaymentDialog from "./RegisterPaymentDialog.vue";
import SellCouponDialog from "./SellCouponDialog.vue";
import ExchangeCouponDialog from "./ExchangeCouponDialog.vue";
import FilterPaymentsDialog from "./FilterPaymentsDialog.vue";
import { paymentTypes } from "@/stores/backendEnums";
import { useDisplay } from "vuetify";

const auth = useAuthStore();
const initialSort = ref([{ key: "date", order: "desc" }]);

const { xs } = useDisplay();
const showAllPayments = ref(false)
const formattedDate = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleString("es-ES"); // Simplificado para el ejemplo
};

const getPTypeIcon = (type) => {
  if (type == paymentTypes[1].value) return "mdi-currency-eur";
  if (type == paymentTypes[2].value) return "mdi-cash";
  if (type == paymentTypes[3].value) return "mdi-credit-card-clock";
  return "mdi-credit-card";
};

const filteredPayments = ref(null);

const payments = computed(() => {
  const base = !filterPayments.value
    ? [...(auth.fallaAdminInfo?.payments || [])]
    : filterPayments.value;

  return base
});

const paymentsToShow = computed(() => {
  const sorted = [...payments.value].sort((a, b) => {
    return new Date(b.date) - new Date(a.date);
  });

    if(showAllPayments.value) {
      return sorted
    }

    const limit = xs.value ? 5 : 10;

    return sorted.slice(0,limit)

});

const selectedPayment = ref(null);
const showInfoDialog = ref(false);
const showRegisterPaymentDialog = ref(false);
const showSellCouponDialog = ref(false);
const showExchangeCouponDialog = ref(false);
const showFilterDialog = ref(false);

const showPaymentInfo = (payment) => {
  selectedPayment.value = payment;
  showInfoDialog.value = true;
};

const registerPayment = () => {
  showRegisterPaymentDialog.value = true;
};

const sellCoupon = () => {
  showSellCouponDialog.value = true;
};

const exchangeCoupon = () => {
  showExchangeCouponDialog.value = true;
};

const filterPayments = () => {
  showFilterDialog.value = true;
};

const handleFilter = (list) => {
  filteredPayments.value = list;
  showFilterDialog.value = false;
};

const headers = [
  {
    title: "Data",
    align: "center",
    key: "date",
    sortable: true,
    cellProps: {
      class: "",
    },
    headerProps: {
      class: " font-weight-bold",
    },
  },
  {
    title: "Tipus",
    align: "center",
    key: "type",
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
    key: "actions",
    sortable: true,
    cellProps: {
      class: "",
    },
    headerProps: {
      class: " font-weight-bold",
    },
  },
  {
    title: "Import total",
    align: "center",
    key: "displayPrice",
    sortable: true,
    cellProps: {
      class: "",
    },
    headerProps: {
      class: " font-weight-bold",
    },
  },
  {
    title: "Gestor",
    align: "center",
    key: "manager",
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
