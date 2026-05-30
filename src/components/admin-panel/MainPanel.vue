<template>
    <v-container>
        <v-card-title>
            Panel de control de la falla: 
        </v-card-title>
        <v-card-title>
            {{ auth.fallaAdminInfo?.name }}
        </v-card-title>
        <v-sheet elevation="2" rounded="lg" :class="xs ?'pa-1' : 'pa-2'">
            <v-tabs v-model="tab" align-tabs="start" class="bg-surface" color="surface" grow>
                <v-tab value="one">Esdeveniments</v-tab>
                <v-tab value="two">Membres</v-tab>
                <v-tab value="three">Inventari</v-tab>
                <v-tab value="four">Moviments</v-tab>
                <v-tab value="five">Pagaments</v-tab>
            </v-tabs>
        </v-sheet>
        <v-divider></v-divider>

        <v-window v-model="tab" :touch="false">
            <v-tabs-window-item value="one">
                <v-row>
                    <v-col cols="12" md="6">
                        <EventPanel/>
                    </v-col>
                    <v-col cols="12" md="6">
                        <TagPanel/>
                    </v-col>
                </v-row>
            </v-tabs-window-item>
            <v-tabs-window-item value="two">
                <UsersPanel/>
                <RequestPanel/>
            </v-tabs-window-item>
            <v-tabs-window-item value="three">
                <ItemTable/>
                <StoreTable/>
            </v-tabs-window-item>
            <v-tabs-window-item value="four">
                <MovementTable/>
                <ContactTable/>
            </v-tabs-window-item>
            <v-tabs-window-item value="five">
                <PaymentPanel/>
                <CouponTable/>
            </v-tabs-window-item>
        </v-window>
    </v-container>

</template>

<script setup>
import { useAuthStore } from '@/stores/auth';
import { ref } from 'vue';
import EventPanel from './event-panel/EventPanel.vue';
import UsersPanel from './user-panel/UsersPanel.vue';
import RequestPanel from './user-panel/RequestPanel.vue';
import TagPanel from './event-panel/TagPanel.vue';
import ItemTable from './inventory-panel/items/ItemTable.vue';
import StoreTable from './inventory-panel/items/StoreTable.vue';
import MovementTable from './inventory-panel/movements/MovementTable.vue';
import ContactTable from './inventory-panel/movements/ContactTable.vue';
import PaymentPanel from './payment-panel/PaymentPanel.vue';
import { useDisplay } from 'vuetify/lib/composables/display';
import CouponTable from './payment-panel/CouponTable.vue';

const auth = useAuthStore()
if(!auth.fallaAdminInfo) {
    auth.fetchFallaAdminInfo()
}
const {xs} = useDisplay()
const tab = ref('one')
</script>