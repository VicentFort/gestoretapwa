<template>
    <v-dialog v-model="internalValue" :max-width=" !xs ? '450px' : '300px'">
         <v-card class="error-dialog">
            <v-card-title class="font-weight-bold">Error: </v-card-title>
            <v-card-text>{{ message }}</v-card-text>
            <v-card-actions>
                <v-btn color="error" variant="text" @click="emit('closed')"  icon="mdi-cancel"/>
            </v-card-actions>
        </v-card>
    </v-dialog>
   
</template>

<script setup>
import { computed } from 'vue'
import { useDisplay } from 'vuetify/lib/composables/display'

const {xs} = useDisplay()

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

<style scoped>

.border-error {
    background-color: rgb(var(--v-theme-error)) !important;
}


</style>