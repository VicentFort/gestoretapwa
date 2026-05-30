<template>
  <v-dialog v-model="show" width="500">
    <v-card v-if="request">
      <v-card-title>Sol·licitud de: {{ request.username }}</v-card-title>
      <v-card-text>Missatge: {{ request.message }}</v-card-text>

      <v-divider></v-divider>

      <v-card-actions>
        <v-btn @click="show = false" icon="mdi-cancel" />
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  modelView: Boolean,
  request: Object,
});
const emit = defineEmits(["update:modelValue"]);
const show = computed({
  get: () => props.modelValue,
  set: (value) => emit("update:modelValue", value),
});
</script>
