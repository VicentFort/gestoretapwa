<template>
    <v-container>
        <v-card v-if="payment" class="bg-primary">
            <v-card-title>Pagament amb id: {{ payment.id }}</v-card-title>
            <v-card-text>Missatge: {{ payment.message }}</v-card-text>
            <v-card-text>Tipus: {{payment.type}}</v-card-text>
            <v-card-text v-if="payment.username">Usuari relacionat: {{ payment.username }}</v-card-text>
            <v-card-text v-if="payment.couponExchanged">Tiquet bescanviat: {{ payment.couponExchanged }}</v-card-text>
            <v-card-text v-if="payment.couponSold">Tiquet venut: {{ payment.couponSold }}</v-card-text>
            <v-card-text v-if="payment.item">Item relacionat: {{ payment.item }}</v-card-text>
            <v-card-actions>
                <v-btn @click="emit('closed')" icon="mdi-cancel" color="ternary"/>
            </v-card-actions>
        </v-card>
    </v-container>
</template>

<script setup>
import { formatDate } from '@/stores/util';

const props = defineProps({
    modelView: Boolean,
    payment: Object
})

const emit = defineEmits(['closed'])

</script>