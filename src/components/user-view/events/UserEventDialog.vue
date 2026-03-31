<template>
    <v-dialog v-model="show" width="500" >
    <v-card v-if="event" class="bg-primary">
      <v-card-title class="bg-secondary">
        Títol: {{ event?.title }}
      </v-card-title>

      <v-card-text class="pa-4">Descripció: {{ event?.description }}</v-card-text>

      <v-card-text class="pa-4">Data: {{ formattedDate }}</v-card-text>

      <v-card-text class="pa-4">Hora: {{ formattedTime }}</v-card-text>

      <v-card-text class="pa-4">Etiqueta: {{ event?.tagName }}</v-card-text>

      <v-divider></v-divider>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="grey-darken-1" class="bg-ternary" variant="text" @click="deleteAssist" :disabled="event.open==false">No assistir</v-btn>
        <v-spacer></v-spacer>
        <v-btn color="grey-darken-1" class="bg-ternary" variant="text" @click="show = false">Tanca</v-btn>
      </v-card-actions>
      <v-dialog v-model=showErrorDiag width=400px>
                <v-card>
                <v-card-title class="text-h5 text-white bg-error">Error</v-card-title>
                    
                    <v-card-text class="pa-4">
                    {{ error }}
                    </v-card-text>
                    
                    <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="error" variant="text" @click="closeError">
                        Tanca
                    </v-btn>
                </v-card-actions>
            </v-card>
            </v-dialog>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { computed, ref } from 'vue';
import { useAuthStore } from '@/stores/auth';
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

const deleteAssist = async () => {
  try {
    await auth.deleteAssist(props.event.id)
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
    return props.event.open ? 'Obert' : 'Tancat'
})
</script>

<style>

</style>