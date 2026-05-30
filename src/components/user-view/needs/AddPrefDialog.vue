<template>
     <v-dialog v-model="show" width="500">
        <v-card>
            <v-card-title class="text-h6">Afig disposició</v-card-title>
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
                        return s.tagId === item.value
                    })"
                ></v-list-item>
            </template>
            </v-select>
            <v-divider></v-divider>
            <v-card-actions>
                <v-btn  variant="text" @click="submitForm" class="" :disabled="tag.id==null" icon="mdi-content-save"/>
                <v-btn  variant="text" @click="show=false" class="" icon="mdi-cancel"/>
            </v-card-actions>

        </v-card>
        <ErrorDialog :message="error" v-model="showErrorDiag" @closed="showErrorDiag=false"/>
  </v-dialog>
</template>

<script setup>

import ErrorDialog from '@/components/ErrorDialog.vue';
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