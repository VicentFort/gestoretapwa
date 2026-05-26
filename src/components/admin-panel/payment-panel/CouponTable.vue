<template>
    <v-card>
        <v-data-table-virtual
        :items="auth.fallaAdminInfo.coupons"
        item-value="id"
        hide-default-footer
        :sort-by="initialSort"
        :headers="headers"
        >
        <template #item.price="{item}">
            {{ item.price }} €
        </template> 
        <template #item.actions="{item}">
            <v-btn icon="mdi-arrow-u-down-left" color="ternary" @click="showEditCouponDialog(item)"/>
        </template>
        </v-data-table-virtual>
    </v-card>
    <v-dialog v-model="showEditCoupon">
        <EditCouponDialog @closed="closeEditCouponDialog" :coupon="selectedCoupon"/>
    </v-dialog>
</template>

<script setup>
import { useAuthStore } from '@/stores/auth';
import { ref } from 'vue';
import EditCouponDialog from './EditCouponDialog.vue';


const auth = useAuthStore()

const showEditCoupon = ref(false)
const selectedCoupon = ref(null)

const initialSort = ref([{key: 'name', order:'desc'}])

const showEditCouponDialog = (coupon) => {
    selectedCoupon.value = coupon
    showEditCoupon.value = true
}

const closeEditCouponDialog = () => {
    selectedCoupon.value = null
    showEditCoupon.value = false
    
}

const headers = [
    {
        title: 'Nom',
        key: 'name',
        align: 'center',
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
        key: 'actions',
        align: 'center',
        sortable: true,
        cellProps: {
            class:"bg-primary"
        },
        headerProps: {
            class:"bg-ternary font-weight-bold"
        }
    },
    {
        title: 'Preu',
        key: 'price',
        align: 'center',
        sortable: true,
        cellProps: {
            class:"bg-primary"
        },
        headerProps: {
            class:"bg-ternary font-weight-bold"
        }
    },
    {
        title: 'Item',
        key: 'item',
        align: 'center',
        sortable: true,
        cellProps: {
            class:"bg-primary"
        },
        headerProps: {
            class:"bg-ternary font-weight-bold"
        }
    },
    {
        title: 'Quantitat total',
        key: 'totalAmount',
        align: 'center',
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