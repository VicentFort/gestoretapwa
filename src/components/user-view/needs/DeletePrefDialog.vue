<template>
    <v-dialog v-model="show" width="600">
        <v-row>
            <v-col>
                <v-card>
                    <v-card-title :style="{ fontSize: titleSize }" class="">
                       Eliminar la disposició?
                    </v-card-title>
                    <v-card-text>
                        {{ pref.description }}
                    </v-card-text>
                    <v-divider></v-divider>
                    <v-card-actions>
                        <v-btn variant="text" class="" @click="deletePref" icon="mdi-delete"/>
                        <v-btn variant="text" class="" @click="exit" icon="mdi-cancel"/>
                    </v-card-actions>
                </v-card>      
            </v-col>
        </v-row>
    
  </v-dialog>
</template>

<script setup>

import { useAuthStore } from '@/stores/auth';
import { computed, ref } from 'vue';
import { useDisplay } from 'vuetify/lib/composables/display';
const auth = useAuthStore()
const props = defineProps({
    modelValue: Boolean,
    pref: Object
})
const emit = defineEmits(['update:modelValue'])
const show = computed({
    get: () => props.modelValue,
    set: (value) => emit('update:modelValue', value)
})
const mobile = useDisplay()

const deletePref = async () => {
    await auth.deletePref(props.pref?.prefId)
    show.value = false

}

const titleSize = computed(() => {
  // name.value devuelve 'xs', 'sm', 'md', 'lg', 'xl'
  switch (mobile.value) {
    case 'xs': return '0.3rem'
    case 'sm': return '0.5rem'
    case 'md': return '0.75rem'
    default: return '1rem'
  }
})

const exit = () => {
    show.value = false
}

</script>