<template>
  <v-row class="fill-height">
    <v-col>
      <v-card>
        <v-card-title class="text-h6">Llistat d'esdeveniments</v-card-title>
        <v-list class="pa-0">
          <v-list-item
            v-for="event in eventsToShow"
            :key="event.id"
            @click="showEvent(event)"
            class="mb-2 rounded-xl pa-4 border"
            style="border-color: rgba(45, 62, 80, 0.08); background: #ffffff"
          >
            <!-- Date Chip -->
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
        <v-card-actions>
          <v-btn
            :icon="showClosed ? 'mdi-filter' : 'mdi-clock-outline'"
            class=""
            @click="toggleClosed"
          />
          <span class="ml-2 text-caption">
            {{ showClosed ? "Mostrant tots" : "Només oberts" }}
          </span>
        </v-card-actions>
        <v-dialog v-model="isDialogOpen" width="auto">
          <FallaEventDialog v-model="isDialogOpen" :event="selectedEvent" />
        </v-dialog>
      </v-card>
    </v-col>
  </v-row>
</template>

<script setup>
import { useAuthStore } from "@/stores/auth";
import { ref, computed } from "vue";
import FallaEventDialog from "./FallaEventDialog.vue";
import { monthLabel, dayLabel } from "@/stores/util.js";

const auth = useAuthStore();
const showClosed = ref(false);
const toggleClosed = () => {
  showClosed.value = !showClosed.value;
};
const eventsToShow = computed(() => {
  if(!auth.userInfo?.fallaInfo) return []
  let base = auth.userInfo?.fallaInfo?.events;

  if (!showClosed.value) {
    base = base.filter((e) => e.active === true);
  }

  return base.sort((a, b) => (b.active ? 1 : 0) - (a.active ? 1 : 0));
});
const isDialogOpen = ref(false);
const selectedEvent = ref(null);

const showEvent = (event) => {
  selectedEvent.value = event;
  isDialogOpen.value = true;
};
</script>
