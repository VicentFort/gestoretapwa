<script setup>
import { useAuthStore } from '@/stores/auth';
import UserEventDialog from './UserEventDialog.vue';
import { ref, computed} from 'vue';
import UserEventAttDialog from './UserEventAttDialog.vue';
import UserEventFilter from './UserEventFilter.vue';


const auth = useAuthStore()
const isDialogOpen = ref(false);
const selectedEvent = ref(null);

const isAttDialogOpen = ref(false);
const selectedAttEvent = ref(null)
const filteredEvents = ref(null);
const showAllAttEvents = ref(false);
const shouldShowClosed = ref(false); // Estado que viene del hijo
const eventsToShow = computed(() => {
    // 1. Tomamos los eventos del filtro o, si no hay filtro, los del store
    let base = filteredEvents.value 
        ? [...filteredEvents.value] 
        : [...(auth.userInfo?.events || [])];

    // 2. Filtramos por estado abierto SOLO si el usuario no ha activado el "ojo"
    if (!shouldShowClosed.value) {
        base = base.filter(e => e.open === true);
    }

    // 3. Ordenamos: Abiertos arriba, cerrados abajo
    return base.sort((a, b) => (b.open ? 1 : 0) - (a.open ? 1 : 0));
});

const attEventsProcesados = computed(() => {
    const originalEvents = auth.userInfo?.attEvents || [];

    if (!showAllAttEvents.value) {
        // Modo inicial: Solo los que están abiertos
        return originalEvents.filter(event => event.open === true);
    } else {
        // Modo "Mostrar todos": Ordenados (open: true arriba)
        return [...originalEvents].sort((a, b) => {
            return (b.open === true ? 1 : 0) - (a.open === true ? 1 : 0);
        });
    }
});

// Función para el botón (toggle)
const toggleAttEvents = () => {
    showAllAttEvents.value = !showAllAttEvents.value;
};


const handleFilter = (list) => {
    filteredEvents.value = list;
};
const handleToggleClosed = (val) => {
    shouldShowClosed.value = val;
};

const showAttEvent = (event) => {
    selectedAttEvent.value = event
    isAttDialogOpen.value = true
}

const showEvent = (event) => {
  selectedEvent.value = event;
  isDialogOpen.value = true;
};
</script>

<template>
    <v-container>
        <v-row rows="12" md="6">
        <v-col>
                <v-container>
                    <v-card class="bg-primary">
                        <v-card-title class="bg-ternary">Assistències</v-card-title>
                        <v-list class="bg-primary event-list">
                            <v-list-item
                                v-for="event in eventsToShow" 
                                :key="event.id"
                                :title="event.title"
                                @click="showEvent(event)"
                                :class="event.open == true ? 'item-open' : 'item-closed'"
                            >
                            </v-list-item>
                        </v-list>
                    </v-card>
                </v-container>
                <v-container>
                    <v-card class="bg-primary">
                        <UserEventFilter 
                            @update-filter="handleFilter" 
                            @toggle-closed="handleToggleClosed"
                        />
                    </v-card>
                </v-container>
        </v-col>
        <v-col>
                <v-container>
                    <v-divider></v-divider>
                    <v-card>
                        <v-card-title class="bg-ternary">Events amb càrrec</v-card-title>
                        <v-list class="bg-primary event-list">
                            <v-list-item
                                v-for="event in attEventsProcesados" 
                                :key="event.id"
                                :title="event.title"
                                @click="showAttEvent(event)"
                                :class="event.open ? 'item-open' : 'item-closed'"
                            >
                            </v-list-item>
                        </v-list>
                        <v-card-actions>
                            <v-btn 
                            :icon="showAllAttEvents ? 'mdi-filter' : 'mdi-clock-outline'" 
                            :class="showAllAttEvents ? 'bg-secondary' : 'bg-ternary'"
                            @click="toggleAttEvents"
                            ></v-btn>
                            <span class="ml-2 text-caption">
                            {{ showAllAttEvents ? 'Mostrant tots' : 'Només oberts' }}
                            </span>
                        </v-card-actions>
                    </v-card>
                    <v-dialog v-model="isDialogOpen" width="auto">
                        <UserEventDialog v-model="isDialogOpen" :event="selectedEvent"/>
                    </v-dialog>
                    <v-dialog v-model="isAttDialogOpen" width="auto">
                        <UserEventAttDialog v-model="isAttDialogOpen" :event="selectedAttEvent"/>
                    </v-dialog>
                </v-container> 
        </v-col> 
        </v-row>
    </v-container>
    
     
</template>

<style>
.v-card{
    border-color: #FF7F50;
    border-width: 10px;
    border-style: solid;
}
</style>