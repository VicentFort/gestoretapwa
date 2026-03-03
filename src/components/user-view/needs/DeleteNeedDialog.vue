<script setup>
import { useAuthStore } from '@/stores/auth';
import { computed, ref } from 'vue';
import { useDisplay } from 'vuetify/lib/composables/display';
const auth = useAuthStore()
const props = defineProps({
    modelValue: Boolean,
    need: Object
})
const emit = defineEmits(['update:modelValue'])
const show = computed({
    get: () => props.modelValue,
    set: (value) => emit('update:modelValue', value)
})
const mobile = useDisplay()

const deleteNeed = async () => {
    await auth.deleteNeed(props.need?.foodNeedId)
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
<template>
    <v-dialog v-model="show" width="600">
        <v-row>
            <v-col>
                <v-card>
                    <v-card-title :style="{ fontSize: titleSize }" class="bg-secondary">
                       Eliminar la necessitat alimentària?
                    </v-card-title>
                    <v-card-text>
                        {{ need.description }}
                    </v-card-text>
                    <v-divider></v-divider>
                    <v-card-actions>
                        <v-btn color="grey-darken-1" variant="text" @click="deleteNeed">Eliminar</v-btn>
                        <v-btn color="grey-darken-1" variant="text" @click="exit">Tanca</v-btn>
                    </v-card-actions>
                </v-card>      
            </v-col>
        </v-row>
    
  </v-dialog>
</template>

<style scoped>

</style>