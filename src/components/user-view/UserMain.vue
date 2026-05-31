<script setup>
import { useAuthStore } from "@/stores/auth";
import UserInfo from "@/components/user-view/UserInfo.vue";
import LoginForm from "../LoginForm.vue";
import { computed, ref } from "vue";
import UserUpdateForm from "@/components/user-view/user-update/UserUpdateForm.vue";
import UserEventInfo from "./events/UserEventInfo.vue";
import UserNeedsInfo from "./needs/UserNeedsInfo.vue";
import { useDisplay } from "vuetify/lib/composables/display";
import UserPrefsInfo from "./needs/UserPrefsInfo.vue";
import NotificationList from "./notifications/NotificationList.vue";
import CouponTable from "./events/coupons/CouponTable.vue";
const auth = useAuthStore();
const tab = ref("one");
const { xs } = useDisplay();

const showCouponTable = ref(false);
const showNotificationsTable = ref(false);

const unreadNotifications = computed(() => {
  return auth.userInfo.notifications.filter((n) => n.read == false).length;
});

const handleCouponExit = async () => {
  this.showCouponTable.value = false
  await auth.fetchUserInfo()
}

const handleLogout = async () => {
  auth.logout();
};
</script>

<template>
  <v-container v-if="auth.token && auth.userInfo" >
      <UserInfo />
      <v-divider/>

    <v-sheet
      elevation="2"
      rounded="lg"
      :class="xs ?'pa-1' : 'pa-2', 'ma-4'"
      align-tabs="start"
    >
      <v-tabs v-model="tab" class="bg-surface" color="surface" grow>
        <v-tab value="one" :class="xs ?'pa-1' : 'pa-5'">Esdeveniments</v-tab>
        <v-tab value="two" :class="xs ?'pa-1' : 'pa-5'">Editar perfil</v-tab>
        <v-tab value="three" :class="xs ?'pa-1' : 'pa-5'">Preferències</v-tab>
        <v-spacer />
        <v-btn
          v-if="!xs"
          @click="showNotificationsTable = true"
          icon="mdi-bell"
          :color="unreadNotifications > 0 ? 'error' : 'surface'"
          class="align-self-center notification-button ms-2"
        />
        <v-btn
          v-if="!xs"
          @click="showCouponTable = true"
          icon="mdi-cash"
          color="surface"
          class="align-self-center notification-button ms-2"
        />
      </v-tabs>
    </v-sheet>
    <v-window v-model="tab" class="mt-4" :touch="false">
      <v-window-item value="one">
        <UserEventInfo />
      </v-window-item>

      <v-window-item value="two">
        <UserUpdateForm />
      </v-window-item>

      <v-window-item value="three">
        <v-row rows="12" md="6">
          <v-col>
            <UserNeedsInfo />
          </v-col>
          <v-col>
            <UserPrefsInfo />
          </v-col>
        </v-row>
      </v-window-item>
    </v-window>
  </v-container>
  <v-container v-if="auth.token">
    <v-btn @click="handleLogout" class="log-out" icon="mdi-logout" />
  </v-container>
  <v-dialog v-model="showCouponTable" min-width="200px">
    <CouponTable @closed="showCouponTable = false; auth.fetchUserInfo()" />
  </v-dialog>
  <v-dialog v-model="showNotificationsTable" min-width="200px">
    <NotificationList @closed="handleCouponExit" />
  </v-dialog>
  <v-container v-if="!auth.token">
    <LoginForm />
  </v-container>
</template>

<style scoped></style>
