<template>
    <v-container>
        <v-card>
            <v-data-table-virtual
            :items="displayedCouponStocks"
            class=""
            no-data-text="No tens tiquets per bescanviar"
            :headers="headers"
            >
            </v-data-table-virtual>
            <v-card-actions>
                <v-spacer/>
                <v-btn @click="emit('closed')" icon="mdi-cancel" />
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
const emit = defineEmits(['closed'])

const headers = [
    {
        title: "Tiquet",
        align: "center",
        key:"coupon",
        sortable:true,
        cellProps: {
            class:""
        },
        headerProps: {
            class:" font-weight-bold bg-secondary"
        }
    },
    {
        title: "Quantitat",
        align: "center",
        key:"amount",
        sortable:true,
        cellProps: {
            class:""
        },
        headerProps: {
            class:" font-weight-bold bg-secondary"
        }
    },
]

</script>