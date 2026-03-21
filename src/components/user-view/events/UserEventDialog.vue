<template>
    <v-dialog v-model="show" width="500" >
    <v-card v-if="event" class="bg-primary">
      <v-card-title class="bg-ternary">
        Títol: {{ event?.title }}
      </v-card-title>

      <v-card-text class="pa-4">Descripció: {{ event?.description }}</v-card-text>

      <v-card-text class="pa-4">Data i hora: {{ event?.date }}</v-card-text>

      <v-card-text class="pa-4">Etiqueta {{ event?.tagName }}</v-card-text>

      <v-divider></v-divider>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="grey-darken-1" class="bg-ternary" variant="text" @click="deleteAssist">No assistir</v-btn>
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
</script>

<style>

</style>