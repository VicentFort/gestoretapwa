<script setup>
import { ref, computed } from "vue";
import EventDialog from "./EventDialog.vue";
import { useAuthStore } from "@/stores/auth";
import EventCreateDialog from "./EventCreateDialog.vue";
import EventFilterDialog from "./EventFilterDialog.vue";
import { dayLabel, monthLabel } from "@/stores/util.js";
const auth = useAuthStore();
const isDetailsOpen = ref(false);
const isCreateOpen = ref(false);
const selectedEvent = ref(null);
const showEventFilter = ref(false)
const filteredEvents = ref(null);
const events = ref(null);
const showClosed = ref(false);
const toggleClosedEvents = () => {
  showClosed.value = !showClosed.value;
};
const handleFilter = (list) => {
  filteredEvents.value = list
  showEventFilter.value = false
}
const orderedEvents = computed(() => {
  let base = events.value
    ? [...events.value]
    : [...(auth.fallaAdminInfo?.events || [])];
  if(filteredEvents.value !== null) {
    return filteredEvents.value.sort((a, b) => (b.active ? 1 : 0) - (a.active ? 1 : 0))
  }

  if (!showClosed.value) {
    base = base.filter((e) => e.active == true);
  }
  return base.sort((a, b) => (b.active ? 1 : 0) - (a.active ? 1 : 0));
});

const openDetails = (event) => {
  selectedEvent.value = event;
  isDetailsOpen.value = true;
};

const openCreateEvent = () => {
  isCreateOpen.value = true;
};
</script>

<template>
  <v-container>
    <v-card>
      <v-card-title class="text-h6"> Llistat d'esdeveniments </v-card-title>
      <v-list class="">
        <v-list-item
          v-for="event in orderedEvents"
          :key="event.id"
          @click="openDetails(event)"
        >
          <template #prepend>
            <div class="date-chip">
              <span class="date-chip__month">{{ monthLabel(event.date) }}</span>
              <span class="date-chip__day">{{ dayLabel(event.date) }}</span>
            </div>
          </template>
          <v-list-item-title class="font-weight-medium">{{
            event.title
          }}</v-list-item-title>
          <v-list-item-subtitle
            >{{ event.startHour }} · {{ event.tagName }}</v-list-item-subtitle
          >
          <template #append>
            <v-chip
              size="small"
              :color="event.active ? 'success' : 'error'"
              variant="tonal"
            >
              {{ event.active ? "Obert" : "Tancat" }}
            </v-chip>
          </template>
        </v-list-item>
      </v-list>

      <v-divider></v-divider>

      <v-dialog v-model="isDetailsOpen" width="auto">
        <EventDialog v-model="isDetailsOpen" :event="selectedEvent" />
      </v-dialog>
      <v-dialog v-model="isCreateOpen" width="auto">
        <EventCreateDialog
          v-model="isCreateOpen"
          @closed="isCreateOpen = false"
        />
      </v-dialog>
      <v-card-actions class="justify-center">
        <v-row>
          <v-col cols="12" md="6">
            <v-btn
            icon="mdi-filter"
            @click="showEventFilter=true"
            />
            <v-btn
            :disabled="!filteredEvents"
            icon="mdi-filter-remove"
            @click="filteredEvents=null"
            />
          </v-col>
          <v-col cols="12" md="6">
            <v-btn
              :icon="showClosed ? 'mdi-filter' : 'mdi-clock-outline'"
              :class="''"
              @click="toggleClosedEvents"
            />
            <span class="ml-2 text-caption">
              {{ showClosed ? "Mostrant tots" : "Només oberts" }}
            </span>
          </v-col>
          <v-col cols="12" md="6">
            <v-btn
              icon="mdi-calendar-plus"
              class="justify-center"
              type="text"
              @click="openCreateEvent"
            />
          </v-col>
          
        </v-row>
      </v-card-actions>
    </v-card>
  </v-container>
  <v-dialog v-model="showEventFilter" min-width="200px">
    <EventFilterDialog @update-filter="handleFilter"/>
  </v-dialog>
</template>

<style></style>
