<template>
    <v-dialog v-model="show" width="500">
    <v-card v-if="event">
      <v-card-title class="text-h5 text-white bg-primary">
        {{ event.name }}
      </v-card-title>

      <v-card-text class="pa-4">
        {{ event.description }}
      </v-card-text>

      <v-card-text>
        Necessitats alimentaries del event: {{ event.foodNeeds?.length }}
      </v-card-text>

      <v-divider>

      </v-divider>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="grey-darken-1" variant="text" @click="show = false">
          Tanca
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { computed, ref } from 'vue';
const props = defineProps({
    modelValue: Boolean,
    event: Object
})
const emit = defineEmits(['update:modelValue'])
const show = computed({
    get: () => props.modelValue,
    set: (value) => emit('update:modelValue', value)
})
</script>