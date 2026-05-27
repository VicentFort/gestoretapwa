<template>
    <v-container>
        <v-card class="bg-primary">
            <v-data-table-virtual
            :items="displayedCouponStocks"
            class="bg-primary"
            no-data-text="No tens tiquets per bescanviar"
            :headers="headers"
            >
            </v-data-table-virtual>
            <v-card-actions>
                <v-btn @click="emits('closed')" icon="mdi-cancel" color="ternary"/>
            </v-card-actions>
        </v-card>
    </v-container>
</template>

<script setup>
import { useAuthStore } from '@/stores/auth';
import { computed } from 'vue';


const auth = useAuthStore()
const displayedCouponStocks = computed(() => {
    return auth.userInfo.couponStocks
})
const emits = defineEmits(['closed'])

const headers = [
    {
        title: "Tiquet",
        align: "center",
        key:"coupon",
        sortable:true,
        cellProps: {
            class:"bg-primary"
        },
        headerProps: {
            class:"bg-ternary font-weight-bold"
        }
    },
    {
        title: "Quantitat",
        align: "center",
        key:"amount",
        sortable:true,
        cellProps: {
            class:"bg-primary"
        },
        headerProps: {
            class:"bg-ternary font-weight-bold"
        }
    },
]

</script>