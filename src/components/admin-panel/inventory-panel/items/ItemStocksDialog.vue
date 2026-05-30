<template>
    <v-container>
        <v-card>
            <v-card-text class="bg-secondary">
            Quantitat total de {{ invItem.name }}:  {{ totalItemAmount }}
            </v-card-text>
            <v-list class="">
                <v-list-item v-for="stock in itemStocks"
                :key="stock.stockId"
                :title="stock.storeName"
                :subtitle="stock.amount"
                />
            </v-list>
            <v-card-actions>
                <v-spacer/>
                <v-btn
                @click="emit('closed')"
                
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
const emit = defineEmits(['closed'])

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