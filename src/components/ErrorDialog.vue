<template>
    <v-dialog v-model="internalValue">
         <v-card class="bg-primary">
            <v-card-title class="text-primary font-weight-bold bg-error">Error: </v-card-title>
                
                <v-card-text class="text-error">
                {{ message }}
                </v-card-text>
                
                <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="error" variant="text" @click="emit('closed')" >
                    Tanca
                </v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
   
</template>

<script setup>
import { computed } from 'vue'


const props = defineProps({
    message: String,
    modelValue: Boolean
})
const emit = defineEmits(['update:modelValue', 'closed'])
const internalValue = computed({
  get() {
    return props.modelValue
  },
  set(value) {
    emit('update:modelValue', value)
    if (!value) emit('closed') 
  }
})
</script>