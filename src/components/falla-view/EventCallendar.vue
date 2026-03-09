<template>
  <v-row class="fill-height">
    <v-col>
      <v-sheet height="64" class="bg-ternary">
        <v-text v-if="calendar" class="text-primary text-body-2 text-sm-h6"> Calendari d'events</v-text>
        <v-toolbar flat class="bg-ternary" density="comfortable">

            <v-spacer></v-spacer>

            <v-btn @click="setToday" class="bg-secondary ms-1" icon-mobile variant="flat">
                <v-icon d-sm-none>mdi-calendar-today</v-icon>
                <span class="d-none d-sm-inline">Huí</span>
            </v-btn>

            <v-btn @click="prev" class="bg-secondary ms-1" icon-mobile variant="flat">
                <v-icon>mdi-chevron-left</v-icon>
                <span class="d-none d-sm-inline">Anterior</span>
            </v-btn>

            <v-btn @click="next" class="bg-secondary ms-1" icon-mobile variant="flat">
                <span class="d-none d-sm-inline">Següent</span>
                <v-icon>mdi-chevron-right</v-icon>
            </v-btn>

            <v-btn @click="viewMonth" class="bg-secondary ms-1" icon-mobile variant="flat">
                <v-icon>mdi-view-module</v-icon>
                <span class="d-none d-sm-inline ms-1">Vista</span>
            </v-btn>
        </v-toolbar>
      </v-sheet>

      <v-sheet height="600">
        <v-calendar
          ref="calendar"
          v-model="focus"
          :events="formattedEvents"
          :type="type"
          color="primary"
          @click:date="viewDay"
          @click:event="showEvent"
          @click:more="viewDay"
        ></v-calendar>

        <v-menu
          v-model="selectedOpen"
        :activator="selectedElement"
        offset-y
        :close-on-content-click="false"
        >
          <v-card min-width="300px" flat>
            <v-toolbar :color="selectedEvent.color" dark>
              <v-toolbar-title>{{ selectedEvent.title }}</v-toolbar-title>
            </v-toolbar>
            <v-card-text>
              <div class="mb-2 text-subtitle-1">
                <strong>Etiqueta:</strong> {{ selectedEvent.tagName }}
              </div>
              <p>{{ selectedEvent.description }}</p>
              <v-divider class="my-2"></v-divider>
              <div><strong>Preu:</strong> {{ selectedEvent.price }}€</div>
              <v-divider class="my-2"></v-divider>
              <div><strong>Inici:</strong> {{ selectedEvent.startHour }}</div>
              <v-divider class="my-2"></v-divider>
              <div><strong>Fí:</strong> {{ selectedEvent.endHour }}</div>
            </v-card-text>
            <v-card-actions>
              <v-btn variant="text" color="secondary" @click="joinEvent">
                Assistir
              </v-btn>
              <v-btn variant="text" color="secondary" @click="selectedOpen = false">
                Tanca
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-menu>
        <v-dialog v-model="showAssistSuccess" max-width="400">
            <v-card>
                <v-card-title class="text-h5 text-white bg-secondary">Assistència guardada al event</v-card-title>
                <v-card-title>{{ selectedEvent.title }}</v-card-title>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="error" variant="text" @click="showAssistSuccess=false">
                        Tanca
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
        <v-dialog v-model="showErrorDiag" max-width="400">
            <v-card>
                <v-card-title class="text-h5 text-white bg-error">Error</v-card-title>
                    
                    <v-card-text class="text-primary">
                    Error al assistir al event
                    </v-card-text>
                    <v-card-text class="text-primary">
                    Probablement ja s'haja registrar l'asistència o s'ha arribat al llímit de persones
                    </v-card-text>
                    
                    <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="error" variant="text" @click="closeError">
                        Tanca
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
      </v-sheet>
    </v-col>
  </v-row>
</template>

<script setup>
import { useAuthStore } from '@/stores/auth'
import { ref, computed } from 'vue'
import '@mdi/font/css/materialdesignicons.css'
const auth = useAuthStore()
const calendar = ref(null)


const error = ref('')
const showErrorDiag = ref(false)
// --- ESTADO ---
const type = ref('month')
const focus = ref('')
const selectedEvent = ref({})
const selectedElement = ref(null)
const selectedOpen = ref(false)
const showAssistSuccess = ref(false)
const typeToLabel = {
  month: 'Mes',
  week: 'Semana',
  day: 'Día',
  '4day': '4 Días',
}
const closeError = () => {
    error.value = ''
    showErrorDiag.value = false
}
const formattedEvents = computed(() => {
  const rawEvents = auth.userInfo?.fallaInfo?.events || []
  

  return rawEvents.map(event => {
   
    const datePart = event.date.includes('T') 
      ? event.date.split('T')[0] 
      : event.date

    // 2. Combinamos con las horas (ya tienen formato HH:mm:ss)
    // El formato final para el constructor será: "2026-03-03T09:23:17"
    const startDateTime = new Date(`${datePart}T${event.startHour}`)
    const endDateTime = new Date(`${datePart}T${event.endHour}`)
    console.log(startDateTime)
    return {
      ...event,
      name: event.title,
      start: startDateTime,
      end: endDateTime,
      timed: !!(event.startHour && event.endHour),
      color: event.done ? 'green' : 'secondary',
    }
  })
})
// --- MÉTODOS ---
function viewDay ({ date }) {
  focus.value = date
  type.value = 'day'
}
function viewMonth() {
    type.value='month'
}

function setToday () {
  focus.value = ''
}

function prev () {
  calendar.value.prev()
}

function next () {
  calendar.value.next()
}
function showEvent (nativeEvent, {event}) {


  const open = () => {
  selectedEvent.value = event
  
  selectedElement.value = nativeEvent.target 

  requestAnimationFrame(() => requestAnimationFrame(() => selectedOpen.value = true))
    }



  if (selectedOpen.value) {

    selectedOpen.value = false

    requestAnimationFrame(() => requestAnimationFrame(() => open()))

  } else {

    open()

  }

  nativeEvent.stopPropagation()

}

const joinEvent = async () => {
    try {
        await auth.joinEvent(selectedEvent.value.id)
        showAssistSuccess.value = true
    } catch(error) {
        error.value=error
        showErrorDiag.value = true
    }
}
</script>