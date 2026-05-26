<script setup>
import { ref, computed } from 'vue';
import EventDialog from './EventDialog.vue';
import { useAuthStore } from '@/stores/auth';
import EventCreateDialog from './EventCreateDialog.vue';
const auth = useAuthStore()
const isDetailsOpen = ref(false);
const isCreateOpen = ref(false)
const selectedEvent = ref(null);
const events = ref(null)
const showClosed = ref(false)
const toggleClosedEvents = () => {
    showClosed.value = !showClosed.value
}
const orderedEvents = computed(() => {
    let base = events.value ? [...events.value] : [...(auth.fallaAdminInfo?.events) || []]

    if(!showClosed.value) {
        base = base.filter(e => e.active == true)
    }
    return base.sort((a,b) => (b.active ? 1 : 0) - (a.active ? 1 : 0))
})

const openDetails = (event) => {
  selectedEvent.value = event;
  isDetailsOpen.value = true;
};

const openCreateEvent = () => {
    isCreateOpen.value = true
}
</script>

<template>
    <v-container>
        <v-card class="bg-primary event-list" >
            <v-card-title class='bg-ternary'>
                Llistat d'esdeveniments
            </v-card-title>
            <v-list class="bg-primary">
                <v-list-item 
                    v-for="event in orderedEvents" 
                    :key="event.id"
                    :title="event.title"
                    link 
                    @click="openDetails(event)"
                    :class="event.active == true ?'item-open' : 'item-closed'"
                >
            </v-list-item>
            </v-list>

            <v-divider></v-divider>

            <v-dialog v-model="isDetailsOpen" width="auto">
                <EventDialog v-model="isDetailsOpen" :event="selectedEvent"/>
            </v-dialog>
            <v-dialog v-model="isCreateOpen" width="auto">
                <EventCreateDialog v-model="isCreateOpen" @closed="isCreateOpen=false"/>
            </v-dialog>
            <v-card-actions class="justify-center">
                <v-row>
                    <v-col cols="12" md="6">
                        <v-btn 
                        :icon="showClosed ? 'mdi-filter' : 'mdi-clock-outline'" 
                        :class="'bg-ternary'"
                        @click="toggleClosedEvents"
                        ></v-btn>
                        <span class="ml-2 text-caption">
                        {{ showClosed ? 'Mostrant tots' : 'Només oberts' }}
                        </span>
                    </v-col>
                    <v-col cols="12" md="6">
                        <v-btn icon="mdi-plus" class="justify-center bg-ternary" type="text" @click='openCreateEvent'/> 

                    </v-col>
                </v-row>
                
            </v-card-actions>
        </v-card>
    </v-container>
</template>

<style>
.v-card{
    border-color: rgb(var(--v-theme-ternary));
    border-width: 10px;
    border-style: solid;
}
</style>