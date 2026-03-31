<template>
     <v-dialog v-model="show" width="500">
        <v-card class="bg-primary">
            <v-card-title class="bg-ternary">Afig disposició</v-card-title>
            <v-select
                v-model="tag.id"
                :items="fallaTags"
                item-title="name"
                item-value="id"
                :rules="[v => !!v || 'Has de seleccionar una etiqueta']"
                persistent-hint
                variant="outlined"
            >
            <template v-slot:item="{ props, item }">
                <v-list-item
                    v-bind="props"
                    :disabled="userPrefTags.some(s => {
                        console.log(s)
                        console.log(item)
                        return s.tagId === item.value
                    })"
                ></v-list-item>
            </template>
            </v-select>
            <v-divider></v-divider>
            <v-card-actions>
                <v-btn  variant="text" @click="submitForm" class="bg-ternary" :disabled="tag.id==null" >Guarda</v-btn>
                <v-btn  variant="text" @click="show=false" class="bg-ternary">Tanca</v-btn>
            </v-card-actions>

        </v-card>
        <v-dialog v-model="showErrorDiag" max-width="400">
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
  </v-dialog>
</template>

<script setup>

import { useAuthStore } from '@/stores/auth';
import { computed, reactive, ref } from 'vue';
const props = defineProps({
    modelValue: Boolean,
})
const error = ref('')
const showErrorDiag = ref(false)

const auth = useAuthStore()

const tag = ref({
    id:null,
    name:''
})

const fallaTags = ref(auth.userInfo?.fallaInfo?.tags)
const userPrefTags = ref(auth.userInfo?.eventTagPrefs)



const emit = defineEmits(['update:modelValue'])

const show = computed({
    get: () => props.modelValue,
    set: (value) => emit('update:modelValue', value),
})
const submitForm = async () => {
    try {
        await auth.addAttPref(tag.value.id)
        show.value=false
    } catch(err) {
        error.value = err
        showErrorDiag.value = true
    }

}
const closeError = () => {
    error.value=''
    showErrorDiag.value = false
}

</script>