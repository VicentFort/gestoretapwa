<template>
    <v-dialog v-model="show" width="500">
            <v-card class="bg-primary pa-2">
                <v-card-title class="bg-ternary">Editar event</v-card-title>
                <v-form ref="form" v-model="valid" @submit.prevent="submitForm">
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
                    <v-col cols="12">
                        <v-textarea
                            v-model="event.description"
                            label="Descripció"
                            :rules="[v => !!v || 'Descripció necessària']"
                            rows="3"
                            required
                        ></v-textarea>
                    </v-col>
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
                            color="secondary"
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
                            :items="auth.fallaAdminInfo.tags"
                            item-title="name"
                            item-value="id"
                            label="Selecciona una etiqueta"
                            :rules="[v => !!v || 'Has de seleccionar una etiqueta']"
                            persistent-hint
                            variant="outlined"
                        ></v-select>
                    </v-col>
                    <v-col cols="12" md="6">
                            <v-text-field type="time"
                                v-model="event.startHour"
                                label="Hora d'inici"
                            />
                        </v-col>
                        <v-col cols="12" md="6">
                            <v-text-field type="time"
                                v-model="event.endHour"
                                label="Hora de fí"
                            />
                        </v-col>
                </v-row>
            
            <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn class="text-white bg-secondary" type="submit" :disabled="!valid">Guarda</v-btn>
            <v-btn class="text-white bg-secondary" variant="text" @click="show = false">Tanca</v-btn>
        </v-card-actions>
        </v-form>
        </v-card>
    </v-dialog>
</template>

<script setup>
import { useAuthStore } from '@/stores/auth';
import { computed, ref } from 'vue';

const auth = useAuthStore()
const valid = ref(false)
const form = ref(null)
const props = defineProps({
    modelView: Boolean,
    event: Object
})

const emit = defineEmits(['update:modelValue'])
const show = computed({
    get: () => props.modelValue,
    set: (value) => emit('update:modelValue', value)
})

const submitForm = async () => {
    const { valid: isValid } = await form.value.validate()
    if (isValid) {
        console.log(props.event)
        await auth.updateEvent(props.event, props.event.id)
        show.value = false
    }
}

</script>
