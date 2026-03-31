<template>
    <v-row class="fill-height">
        <v-col>
            <v-card class="bg-primary">
                <v-card-title class="bg-ternary">Llistat d'events</v-card-title>
                <v-list class="bg-primary event-list">
                    <v-list-item
                        v-for="event in eventsToShow" 
                        :key="event.id"
                        :title="event.title"
                        @click="showEvent(event)"
                        :class="event.open == true  ? 'item-open' : 'item-closed'"
                    >
                </v-list-item>
                </v-list>
                <v-card-actions>
                    <v-btn 
                    :icon="showClosed ? 'mdi-filter' : 'mdi-clock-outline'" 
                    :class="showClosed ? 'bg-secondary' : 'bg-ternary'"
                    @click="toggleClosed"
                    ></v-btn>
                    <span class="ml-2 text-caption">
                    {{ showClosed ? 'Mostrant tots' : 'Només oberts' }}
                    </span>
                </v-card-actions>
                <v-dialog v-model="isDialogOpen" width="auto">
                    <FallaEventDialog v-model="isDialogOpen" :event="selectedEvent"/>
                </v-dialog>        
            </v-card>
        </v-col>
    </v-row>
    
</template>

<script setup>
import { useAuthStore } from '@/stores/auth';
import { ref, computed } from 'vue';
import FallaEventDialog from './FallaEventDialog.vue';


const auth = useAuthStore()
const showClosed = ref(false)
const toggleClosed = () => {
    showClosed.value = !showClosed.value
}
const eventsToShow = computed(() => {
    let base = auth.userInfo.fallaInfo?.events

    // 2. Filtramos por estado abierto SOLO si el usuario no ha activado el "ojo"
    if (!showClosed.value) {
        base = base.filter(e => e.open === true);
    }

    // 3. Ordenamos: Abiertos arriba, cerrados abajo
    return base.sort((a, b) => (b.open ? 1 : 0) - (a.open ? 1 : 0));
})
const isDialogOpen = ref(false);
const selectedEvent = ref(null);

const showEvent = (event) => {
  selectedEvent.value = event;
  isDialogOpen.value = true;
};

</script>
