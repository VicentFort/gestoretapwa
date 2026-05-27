<script setup>
import { useAuthStore } from '@/stores/auth';
import { computed, ref } from 'vue';
import { useDisplay } from 'vuetify/lib/composables/display';
import CouponTable from './events/coupons/CouponTable.vue';
import NotificationList from './notifications/NotificationList.vue';
const auth = useAuthStore()
const {xs} = useDisplay()

const showNotificationsTable = ref(false)
const showCouponTable = ref(false)

const unreadNotifications = computed(() => {
    return auth.userInfo.notifications.filter( n => n.read == false).length
})

</script>

<template>
    <v-container>
        <v-label class='text-black' :text="'Hola: '"></v-label>
        <br>
        <v-label class='text-black'>{{ auth.userInfo.name }} {{ auth.userInfo.surname }} </v-label>
        <br v-if="auth.userInfo?.nickname">
        <v-label v-if="auth.userInfo?.nickname" class='text-black'>{{ auth.userInfo?.nickname }}</v-label>
        <v-img v-if="auth.userPfp">
            <img width="80" height="80" :src="auth.userPfp">
        </v-img>
        <v-spacer/>
        <v-row v-if="xs" class="justify-center">
            <v-btn @click="showNotificationsTable=true" icon="mdi-bell" :color="unreadNotifications > 0 ? 'error' : 'ternary' " class="align-self-center ms-2"/>
            <v-btn @click="showCouponTable=true" icon="mdi-cash" color="success" class="align-self-center ms-2"/>
        </v-row>
        <v-dialog v-model="showCouponTable" width="auto">
            <CouponTable @closed="showCouponTable=false"/>
        </v-dialog>
        <v-dialog v-model="showNotificationsTable" width="auto">
            <NotificationList @closed="showNotificationsTable=false"/>
        </v-dialog>
    </v-container>
    
      
</template>

<style>

</style>