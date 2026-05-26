<template>
    <v-dialog v-model="show" width="500">
    <v-card v-if="tag" class="bg-primary">
      <v-card-title class="text-h5 text-primary bg-ternary">
        {{  tag.name }}
      </v-card-title>

      <v-divider></v-divider>

      <v-card-actions class="justify-center align-center">
        <v-btn icon="mdi-tag-minus" class="text-primary bg-ternary" variant="text" @click="confirmDelete"/>
        <v-spacer></v-spacer>
        <v-btn icon="mdi-cancel" class="text-primary bg-ternary" variant="text" @click="show = false"/>
      </v-card-actions>
      <v-dialog v-model="showDeleteDialog" max-width="400">
        <v-card>
          <v-card-title class="text-h5 text-white bg-error">¿Vols eliminar la etiqueta?</v-card-title>
          
          <v-card-text class="pa-4">
            Estàs a punt d'eliminar la etiqueta: 
            <strong>{{ tag?.name }}</strong>.
            <br><br>
            <span class="text-caption text-black">Esta acció no es pot desfer i s'eliminaran tots els events associats.</span>
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
import { computed, ref } from 'vue';
const auth = useAuthStore()
const showDeleteDialog = ref(false)
const loading = ref(false)
const props = defineProps({
    modelValue: Boolean,
    tag: Object
})
const emit = defineEmits(['update:modelValue'])
const show = computed({
    get: () => props.modelValue,
    set: (value) => emit('update:modelValue', value)
})

const confirmDelete = () => {
  showDeleteDialog.value = true
}

const executeDelete = async () => {
  if (!props.tag) return
  loading.value = true
  try {
    await auth.deleteTag(props.tag.id)
    
    showDeleteDialog.value = false
    show.value = false
 
  } catch (error) {
    console.error("Error al borrar:", error)

  } finally {
    loading.value = false
    auth.fetchFallaAdminInfo()
  }
}
</script>