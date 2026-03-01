<template>
    <v-dialog v-model="show" width="500" theme="form">
       
            
            <v-form ref="form" v-model="valid" @submit.prevent="submitForm">
                <v-card class="pa-5">
                    <v-card-title>Afegir event</v-card-title>
                    <v-row>
                        <v-col cols="12">
                            <v-text-field
                                v-model="event.title"
                                :counter="100"
                                label="Títol"
                                :rules="[v => !!v || 'Títol necessari']"
                                required
                            ></v-text-field>
                        </v-col>
                        <v-cols cols="12">
                            <v-textarea
                                v-model="event.description"
                                label="Descripció"
                                :rules="[v => !!v || 'Descripció necessària']"
                                rows="3"
                                required
                            ></v-textarea>
                        </v-cols>
                        <v-col cols="12" md="6">
                            <v-text-field 
                                v-model.number="event.price"
                                label="Preu"
                                type="number"
                                prefix="€"
                            ></v-text-field>
                        </v-col>
                            
                        <v-col cols="12" md="6">
                            <v-text-field
                                v-model.number="event.maxPeople"
                                label="Aforament"
                                type="number"
                            ></v-text-field>
                        </v-col>

                        <v-col cols="12" class="justify-center d-flex">
                            <v-date-picker
                                v-model="event.date"
                                theme="form"
                                color="primary"
                                width="100%"
                            ></v-date-picker>
                        </v-col>

                        <v-col cols="12">
                            <v-switch
                                v-model="event.publicField"
                                label="Event públic"
                                color="primary"
                            ></v-switch>
                        </v-col>

                        <v-col cols="12" md="6">
                            <v-select
                                v-model="event.tagId"
                                :items="tags"
                                item-title="name"
                                item-value="id"
                                label="Selecciona una etiqueta"
                                :rules="[v => !!v || 'Debes seleccionar una etiqueta']"
                                persistent-hint
                                variant="outlined"
                            ></v-select>
                        </v-col>
                    </v-row>
                </v-card>
                <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="success" type="submit" :disabled="!valid">Crear</v-btn>
                <v-btn color="grey-darken-1" variant="text" @click="show = false">Tanca</v-btn>
            </v-card-actions>
            </v-form>
            
    </v-dialog>
</template>

<script setup>
import { useAuthStore } from '@/stores/auth';
import { computed, reactive, ref } from 'vue';

const auth = useAuthStore()
const valid = ref(false)
const form = ref(null)
const event = reactive({
  title: '',
  publicField: true,
  description: '',
  price: 0,
  maxPeople: 0,
  date: new Date(),
  fallaId: auth.fallaAdminInfo.fallaId,
  tagId: null
})
const tags = ref(auth.fallaAdminInfo.tags || null)
const props = defineProps({
    modelValue: Boolean
})
const emit = defineEmits(['update:modelValue'])
const show = computed({
    get: () => props.modelValue,
    set: (value) => emit('update:modelValue', value)
})

const submitForm = async () => {
    const { valid: isValid } = await form.value.validate()
    if (isValid) {
        console.log('Datos del evento:', event)
        await auth.addEvent(event)
        show.value = false
    }
}
</script>

<style scoped>
.dialog-title {
    background-color: slateblue;
}
</style>