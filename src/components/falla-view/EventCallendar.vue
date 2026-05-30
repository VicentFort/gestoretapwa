<template>
  <v-row class="fill-height">
    <v-col>
      <v-card>
      <v-sheet height="64">
        <v-card-title v-if="calendar"> Calendari d'esdeveniments</v-card-title>
        <v-toolbar flat  density="comfortable">

            <v-spacer></v-spacer>

            <v-btn @click="setToday"  icon-mobile variant="flat">
                <v-icon d-sm-none>mdi-calendar-today</v-icon>
                <span class="d-none d-sm-inline">Huí</span>
            </v-btn>

            <v-btn @click="prev" icon-mobile variant="flat">
                <v-icon>mdi-chevron-left</v-icon>
                <span class="d-none d-sm-inline">Anterior</span>
            </v-btn>

            <v-btn @click="next" icon-mobile variant="flat">
                <span class="d-none d-sm-inline">Següent</span>
                <v-icon>mdi-chevron-right</v-icon>
            </v-btn>

            <v-btn @click="viewMonth" icon-mobile variant="flat">
                <v-icon>mdi-view-module</v-icon>
                <span class="d-none d-sm-inline ms-1">Vista</span>
            </v-btn>
        </v-toolbar>
      </v-sheet>

      <v-sheet height="600">
        <v-calendar
        class=""
          ref="calendar"
          v-model="focus"
          :events="formattedEvents"
          :type="type"
          
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
          <v-card min-width="300px" flat :class="selectedEvent.active ?'event-dialog-open' : 'event-closed-dialog'">
            <v-card-title :class="event.active ?'' : 'event-closed-dialog'">{{ selectedEvent.title }}</v-card-title>
            <v-card-text>
              <div>
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
              <v-btn variant="text" @click="joinEvent" icon="mdi-plus"/>
              <v-btn variant="text" @click="selectedOpen = false" icon="mdi-cancel"/>
            </v-card-actions>
          </v-card>
        </v-menu>
        <v-dialog v-model="showAssistSuccess" max-width="400">
            <v-card>
                <v-card-title>Assistència guardada al esdeveniment</v-card-title>
                <v-card-title>{{ selectedEvent.title }}</v-card-title>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn  variant="text" @click="showAssistSuccess=false" icon="mdi-cancel"/>
                </v-card-actions>
            </v-card>
        </v-dialog>
        <ErrorDialog :message="error" v-model="showErrorDiag" @closed="showErrorDiag=false"/>
      </v-sheet>
      </v-card>
    </v-col>
  </v-row>
</template>

<script setup>
import { useAuthStore } from '@/stores/auth'
import { ref, computed } from 'vue'
import '@mdi/font/css/materialdesignicons.css'
import ErrorDialog from '@/components/ErrorDialog.vue'
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
   
    const dateStartPart = event.date.includes('T') 
      ? event.date.split('T')[0] 
      : event.date
    const dateEndPart = event.endDate.includes('T') ? event.endDate.split('T')[0] : event.endDate

    // 2. Combinamos con las horas (ya tienen formato HH:mm:ss)
    // El formato final para el constructor será: "2026-03-03T09:23:17"
    const startDateTime = new Date(`${dateStartPart}T${event.startHour}`)
    const endDateTime = new Date(`${dateEndPart}T${event.endHour}`)
    return {
      ...event,
      name: event.title,
      start: startDateTime,
      end: endDateTime,
      timed: !!(event.startHour && event.endHour),
      color: event.active ? 'secondary' : 'error',
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

<style>


</style>