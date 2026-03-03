<template>
    <v-dialog v-model="show" width="500">
    <v-card v-if="event">
      <v-card-title class="text-h5 text-white bg-secondary">
        {{  event.title }}
      </v-card-title>
      <v-card-text class="pa-4">
        {{ event.description }}
      </v-card-text>
      <v-card-text>
        Etiqueta: {{ event.tagName }}
      </v-card-text>
      <v-card-text>
        Data: {{ event.date }}
      </v-card-text>
      <v-card-text>
        Necessitats alimentaries del event: {{ event.foodNeeds?.length }}
      </v-card-text>
      <v-card-text>
        Encarregats del event: {{ event.attendantNames?.length }}
      </v-card-text>

      <v-divider>

      </v-divider>

      <v-card-actions>
        <v-btn class="bg-secondary" variant="text" @click="showEditDialog = true">
          Edita
        </v-btn>
        <v-btn class="bg-secondary" variant="text" @click="confirmDelete">
          Elimina
        </v-btn>
        <v-spacer></v-spacer>
        <v-btn class="bg-secondary" variant="text" @click="show = false">
          Tanca
        </v-btn>
      </v-card-actions>
      <v-dialog v-model="showEditDialog" width="auto">
        <EventEditDialog v-model="showEditDialog" :event="selectedEvent"/>
      </v-dialog>
      <v-dialog v-model="showDeleteDialog" max-width="400">
        <v-card>
          <v-card-title class="text-h5 text-white bg-error">¿Vols eliminar el event?</v-card-title>
          
          <v-card-text class="pa-4">
            Estàs a punt d'eliminar el event: 
            <strong>{{ event?.title }}</strong>.
            <br><br>
            <span class="text-caption text-grey">Esta acció no es pot desfer.</span>
          </v-card-text>

          <v-divider></v-divider>

          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              variant="text"
              @click="showDeleteDialog = false"
              :disabled="loading"
            >
              Cancelar
            </v-btn>
            <v-btn
              color="error"
              variant="elevated"
              :loading="loading"
              @click="executeDelete"
            >
              Eliminar definitivament
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { useAuthStore } from '@/stores/auth';
import EventEditDialog from '@/components/admin-panel/event-panel/EventEditDialog.vue'
import { computed, ref } from 'vue';
const showDeleteDialog = ref(false)
const showEditDialog = ref(false)
const loading = ref(false)
const auth = useAuthStore()
const props = defineProps({
    modelValue: Boolean,
    event: Object
})
const selectedEvent = ref(props.event)
const emit = defineEmits(['update:modelValue'])
const show = computed({
    get: () => props.modelValue,
    set: (value) => emit('update:modelValue', value)
})



const confirmDelete = () => {
  showDeleteDialog.value = true
}

const executeDelete = async () => {
  if (!props.event) return
  loading.value = true
  try {
    await auth.deleteEvent(props.event.id)
    
    // Si tiene éxito:
    showDeleteDialog.value = false
    show.value = false
    // Aquí podrías emitir un evento para refrescar la lista de eventos
    // emit('refresh') 
  } catch (error) {
    console.error("Error al borrar:", error)
  } finally {
    loading.value = false
    auth.fetchFallaAdminInfo()
  }

}
</script>