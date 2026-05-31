<script setup>
import { useAuthStore } from "@/stores/auth";
import { computed, ref } from "vue";
import { useDisplay } from "vuetify/lib/composables/display";
import CouponTable from "./events/coupons/CouponTable.vue";
import NotificationList from "./notifications/NotificationList.vue";
const auth = useAuthStore();
const { xs } = useDisplay();

const showNotificationsTable = ref(false);
const showCouponTable = ref(false);

const unreadNotifications = computed(() => {
  return auth.userInfo.notifications.filter((n) => n.read == false).length;
});
</script>

<template>
  <v-container class="justify-center">
   <v-row class="justify-center ma-4">
      <v-col cols="12" md="6">
        <v-label class="text-secondary ma-4 pa-2">Hola: {{ auth.userInfo.name }} {{ auth.userInfo.surname }} </v-label>
        <br v-if="auth.userInfo?.nickname" />
        <v-label v-if="auth.userInfo?.nickname" class="text-secondary ma-4 pa-2">({{auth.userInfo?.nickname}})</v-label>
      </v-col>
      <v-spacer/>
      <v-col cols="12" md="6">
        <v-img v-if="auth.userPfp">
          <img width="120" height="120" :src="auth.userPfp" />
        </v-img>
      </v-col>
    </v-row>
    <v-spacer />
    <v-row v-if="xs" class="justify-center align-center ga-4">
        <v-btn
          @click="showNotificationsTable = true"
          icon="mdi-bell"
          :color="unreadNotifications > 0 ? 'error' : 'success'"
          class="align-self-center ms-2"
        />
        <v-btn
          @click="showCouponTable = true"
          icon="mdi-cash"
          color="success"
          class="align-self-center ms-2"
        />
    </v-row>
    <v-dialog v-model="showCouponTable" width="auto">
      <CouponTable @closed="showCouponTable = false" />
    </v-dialog>
    <v-dialog v-model="showNotificationsTable" width="auto">
      <NotificationList @closed="showNotificationsTable = false" />
    </v-dialog>
  </v-container>
</template>

<style></style>
