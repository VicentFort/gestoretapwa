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
              <div
                class="flex-column justify-center mr-4 align-center date-chip d-flex"
              >
                <span class="text-caption font-weight-bold text-grey-darken-1">
                  {{ monthLabel(event.date) }}
                </span>
                <span
                  class="font-weight-bold text-tertiary"
                  style="
                    font-family: 'Instrument Serif', serif;
                    font-size: 1.125rem;
                  "
                >
                  {{ dayLabel(event.date) }}
                </span>
              </div>
            </template>

            <v-list-item-title class="font-weight-medium text-body-1">
              {{ event.title }}
            </v-list-item-title>
            <v-list-item-subtitle class="text-medium-emphasis">
              {{ event.date }} · {{ event.startHour }}
            </v-list-item-subtitle>
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
  let base = auth.userInfo.fallaInfo?.events;

  // 2. Filtramos por estado abierto SOLO si el usuario no ha activado el "ojo"
  if (!showClosed.value) {
    base = base.filter((e) => e.active === true);
  }

  // 3. Ordenamos: Abiertos arriba, cerrados abajo
  return base.sort((a, b) => (b.active ? 1 : 0) - (a.active ? 1 : 0));
});
const isDialogOpen = ref(false);
const selectedEvent = ref(null);

const showEvent = (event) => {
  selectedEvent.value = event;
  isDialogOpen.value = true;
};
</script>
