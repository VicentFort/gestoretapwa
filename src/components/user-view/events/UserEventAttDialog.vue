<template>
    <v-dialog v-model="show" width="500" >
    <v-card v-if="event" class="bg-primary">
      <v-card-title class="bg-ternary">
        Títol: {{ event?.title }}
      </v-card-title>

      <v-card-text class="pa-4">Descripció: {{ event?.description }}</v-card-text>

      <v-card-text class="pa-4">Data: {{ formattedDate }}</v-card-text>

      <v-card-text class="pa-4">Hora: {{ formattedTime }}</v-card-text>

      <v-card-text class="pa-4">Etiqueta: {{ event?.tagName }}</v-card-text>


      <v-divider></v-divider>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="grey-darken-1" variant="text" class="bg-ternary" @click="assistEvent" :disabled="event.active==false">Assistir</v-btn>
        <v-spacer></v-spacer>
        <v-btn color="grey-darken-1" variant="text"  class="bg-ternary" @click="show = false">Tanca</v-btn>
      </v-card-actions>
      <ErrorDialog :message="error" v-model="showErrorDiag" @closed="showErrorDiag=false"/>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { computed, ref } from 'vue';
import { useAuthStore } from '@/stores/auth';
import ErrorDialog from '@/components/ErrorDialog.vue';
const auth = useAuthStore()
const props = defineProps({
    modelValue: Boolean,
    event: Object
})
const emit = defineEmits(['update:modelValue'])
const show = computed({
    get: () => props.modelValue,
    set: (value) => emit('update:modelValue', value)
})

const error = ref('')
const showErrorDiag = ref(false)

const closeError = () => {
  error.value = ''
  showErrorDiag.value = false
}

const assistEvent = async () => {
  try {
    await auth.joinEvent(props.event.id)
    show.value = false
  } catch (err) {
    error.value=err 
    showErrorDiag.value = true   
  }
}

//Para mostrar las fechas formateadas del evento. Si es en el mismo dia muestra solo la fecha inicial, si es de varios muestra las 2.
const formattedDate = computed(() => {
    if(props.event.date == props.event.endDate) return `${new Date(props.event.date).toLocaleDateString('ca-ES',{
      day:'2-digit',
      month:'2-digit',
      year:'2-digit'
    })}`
    return `${new Date(props.event.date).toLocaleDateString('ca-ES',{
      day:'2-digit',
      month:'2-digit',
      year:'2-digit'
    })} fins a: ${new Date(props.event.endDate).toLocaleDateString('ca-ES',{
      day:'2-digit',
      month:'2-digit',
      year:'2-digit'
    })}` 
})

const formattedTime = computed(() => {
    return `${props.event.startHour.substring(0,2)}:${props.event.startHour.substring(3,5)}`
})

const formattedOpen = computed(() => {
    return props.event.active ? 'Obert' : 'Tancat'
})
</script>

<style>

</style>