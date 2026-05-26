<template>
    <v-card>
        
            <v-row rows="12" md="6" class="justify-center">
                <v-btn
                @click="filterPayments()"
                icon="mdi-filter"
                color="secondary"
                />
                <v-btn
                @click="filteredPayments = null"
                icon="mdi-filter-minus"
                color="secondary"
                :disabled="!filteredPayments"
                />
                <v-spacer/>
                <v-btn
                @click="registerPayment()"
                icon="mdi-plus"
                color="transaction"
                />
                <v-btn
                @click="sellCoupon()"
                icon="mdi-currency-eur"
                color="transaction"
                />
                <v-btn
                @click="exchangeCoupon()"
                icon="mdi-cash"
                color="transaction"
                />
            </v-row>
        <v-data-table-virtual
            :items="paymentsToShow"
            item-value="id"
            hide-default-footer
            :sort-by="initialSort"
            :headers="headers"
            :key="paymentsToShow.length"
            >
            <template #item.actions="{item}">
                <v-btn
                icon="mdi-information"
                variant="text"
                color="ternary"
                @click="showPaymentInfo(item)"
                />
            </template>
            <template #item.date="{ item }">
                {{ formattedDateTime(item.date) }}
            </template>
        </v-data-table-virtual>
        <v-divider/>
        
    </v-card>
    <v-dialog v-model="showInfoDialog" width="auto">
        <PaymentDetails :payment="selectedPayment" @closed="showInfoDialog=false; selectedPayment=null"/>
    </v-dialog>
    <v-dialog v-model="showRegisterPaymentDialog" width="auto">
        <RegisterPaymentDialog @closed="showRegisterPaymentDialog=false; filteredPayments=null"/>
    </v-dialog>
    <v-dialog v-model="showSellCouponDialog" width="auto">
        <SellCouponDialog @closed="showSellCouponDialog=false; filteredPayments=null""/>
    </v-dialog>
    <v-dialog v-model="showExchangeCouponDialog" width="auto">
        <ExchangeCouponDialog @closed="showExchangeCouponDialog=false; filteredPayments=null""/>
    </v-dialog>
    <v-dialog v-model="showFilterDialog" width="auto">
        <FilterPaymentsDialog @update-filter="handleFilter" @closed="showFilterDialog=false" />
    </v-dialog>
</template>

<script setup>
import { useAuthStore } from '@/stores/auth';
import { computed, ref } from 'vue';
import PaymentDetails from './PaymentDetails.vue';
import {formattedDateTime} from '@/stores/util';
import RegisterPaymentDialog from './RegisterPaymentDialog.vue';
import SellCouponDialog from './SellCouponDialog.vue';
import ExchangeCouponDialog from './ExchangeCouponDialog.vue';
import FilterPaymentsDialog from './FilterPaymentsDialog.vue';

const auth = useAuthStore()
const initialSort = ref([{key:'date', order:'desc'}])


const filteredPayments = ref(null)
const paymentsToShow = computed(() => {
    return filteredPayments.value ? [...filteredPayments.value] : [...(auth.fallaAdminInfo.payments || [])]
})

const selectedPayment = ref(null)
const showInfoDialog = ref(false)
const showRegisterPaymentDialog = ref(false)
const showSellCouponDialog = ref(false)
const showExchangeCouponDialog = ref(false)
const showFilterDialog = ref(false)

const showPaymentInfo = (payment) => {
    selectedPayment.value = payment
    showInfoDialog.value = true
}

const registerPayment = () => {
    showRegisterPaymentDialog.value = true
}

const sellCoupon = () => {
    showSellCouponDialog.value = true
}

const exchangeCoupon = () => {
    showExchangeCouponDialog.value = true
}

const filterPayments = () => {
    showFilterDialog.value = true
}

const handleFilter = (list) => {
    filteredPayments.value = list
    showFilterDialog.value = false
}

const headers = [
    {
        title: "Data",
        align: "center",
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
        title: "Tipus",
        align: "center",
        key:"type",
        sortable:true,
        cellProps: {
            class:"bg-primary"
        },
        headerProps: {
            class:"bg-ternary font-weight-bold"
        }
    },
    {
        title: "Import total",
        align:"center",
        key:"displayPrice",
        sortable:true,
        cellProps: {
            class:"bg-primary"
        },
        headerProps: {
            class:"bg-ternary font-weight-bold"
        }
    },
    {
        title: "Gestor",
        align: "center",
        key:"manager",
        sortable:true,
        cellProps: {
            class:"bg-primary"
        },
        headerProps: {
            class:"bg-ternary font-weight-bold"
        }
    },
    {
        title: "Accions",
        align: "center",
        key:"actions",
        sortable:true,
        cellProps: {
            class:"bg-primary"
        },
        headerProps: {
            class:"bg-ternary font-weight-bold"
        }
    }
]

</script>