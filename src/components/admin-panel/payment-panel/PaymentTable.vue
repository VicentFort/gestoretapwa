<template>
    <v-card>
        <v-data-table-virtual
            :items="payments"
            item-value="id"
            hide-default-footer
            :sort-by="initialSort"
            :headers="headers"
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
            <template #item.price="{item}">
                {{  }}
            </template>
        </v-data-table-virtual>
        <v-divider/>
        <v-btn
        @click="registerPayment()"
        icon="mdi-plus"
        color="ternary"
        />
    </v-card>
    <v-dialog v-model="showInfoDialog" width="auto">
        <PaymentDetails :payment="selectedPayment" @closed="showInfoDialog=false; selectedPayment=null"/>
    </v-dialog>
    <v-dialog v-model="showRegisterPaymentDialog" width="auto">
        <RegisterPaymentDialog @closed="showRegisterPaymentDialog=false"/>
    </v-dialog>
</template>

<script setup>
import { useAuthStore } from '@/stores/auth';
import { computed, ref } from 'vue';
import PaymentDetails from './PaymentDetails.vue';
import {formattedDateTime} from '@/stores/util';
import RegisterPaymentDialog from './RegisterPaymentDialog.vue';

const auth = useAuthStore()
const payments = ref(auth.fallaAdminInfo?.payments)
const initialSort = ref([{key:'date', order:'desc'}])

const selectedPayment = ref(null)
const showInfoDialog = ref(false)
const showRegisterPaymentDialog = ref(false)


const showPaymentInfo = (payment) => {
    selectedPayment.value = payment
    showInfoDialog.value = true
}

const registerPayment = () => {
    showRegisterPaymentDialog.value = true
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