<script setup>
import { useAuthStore } from '@/stores/auth';
import { computed, ref } from 'vue';
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

const deleteNeed = async () => {
    await auth.deleteNeed(props.need?.foodNeedId)
    show.value = false

}

const exit = () => {
    show.value = false
}
</script>
<template>
    <v-dialog v-model="show" class="need-delete-diag">
        <v-card>
             <v-card-title class="text-h5 text-white bg-primary">
            Va a eliminar la necessitat alimentària: {{ need.description }}
            </v-card-title>
            <v-divider></v-divider>
            <v-card-actions>
                <v-btn color="grey-darken-1" variant="text" @click="deleteNeed">Eliminar</v-btn>
                <v-btn color="grey-darken-1" variant="text" @click="exit">Cancel·la</v-btn>
            </v-card-actions>
            

        </v-card>
        
       
  </v-dialog>
</template>

<style scoped>

.need-delete-diag{
    width: 750px;
    justify-items: center;
}
</style>