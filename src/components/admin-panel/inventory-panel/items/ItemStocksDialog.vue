<template>
    <v-container>
        <v-card class="bg-primary">
            <v-card-text>
            Quantitat total de {{ invItem.name }}:  {{ totalItemAmount }}
            </v-card-text>
            <v-list class="bg-primary">
                <v-list-item v-for="stock in itemStocks"
                :key="stock.stockId"
                :title="stock.storeName"
                :subtitle="stock.amount"
                />
            </v-list>
            <v-card-actions>
                <v-btn
                @click="emits('closed')"
                color="ternary"
                icon="mdi-cancel"
                />
            </v-card-actions>
        </v-card>
    </v-container>
</template>

<script setup>
import { useAuthStore } from '@/stores/auth';
import { computed } from 'vue';


const auth = useAuthStore()
const props = defineProps({
    modelView: Boolean,
    invItem: Object
})
const emits = defineEmits(['closed'])

const totalItemAmount = computed(() => {
    let count = 0;
    if(!props.invItem.stocks || props.invItem.stocks.length <= 0) return count;
    props.invItem.stocks.forEach(element => {
        count += element.amount
    });
    return count;
})

const itemStocks = computed(() => {
    if(!props.invItem.stocks) return []
    if(props.invItem.stocks.length <= 0) return []
    return props.invItem.stocks
})



</script>