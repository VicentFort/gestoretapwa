<template>
    <v-dialog v-model="show" width="500">
                <v-card class="pa-2">
                    <v-card-title class="bg-secondary">Afegir event</v-card-title>
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
                                v-model="selectedTag"
                                :items="tags"
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
                        <v-col cols="12" md="6">
                            <v-select
                                v-model="selectedUsers"
                                :items="filterUsers"
                                :disabled="!selectedTag"
                                :hint="!selectedTag ? 'Selecciona una etiqueta primer' : 'Usuaris disponibles'"
                                persistent-hint
                                item-title="username"
                                item-value="id"
                                label="2. Usuaris disponibles"
                                multiple
                                chips
                                variant="outlined"
                                class="mt-4"
                                >
                                <template v-slot:chip="{ props, item }">
                                    <v-chip
                                    v-bind="props"
                                    :text="item.raw.username" 
                                    ></v-chip>
                                </template>
                                <template v-slot:no-data>
                                    <v-list-item>
                                    <v-list-item-title>
                                        No hi ha usuaris disponibles per a l'etiqueta "{{ selectedTag.name }}"
                                    </v-list-item-title>
                                    </v-list-item>
                                </template>
                            </v-select>
                        </v-col>
                    </v-row>
                
                <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn class="text-white bg-secondary" type="submit" :disabled="!valid">Crear</v-btn>
                <v-btn class="text-white bg-secondary" variant="text" @click="show = false">Tanca</v-btn>
            </v-card-actions>
            </v-form>
            </v-card>
            
    </v-dialog>
</template>

<script setup>
import { useAuthStore } from '@/stores/auth';
import { computed, reactive, ref, watch } from 'vue';


const auth = useAuthStore()
const users = ref(auth.fallaAdminInfo.users)
const tags = ref(auth.fallaAdminInfo.tags)
const selectedTag = ref(null)
const selectedUsers = ref([])
const filterUsers = computed(() => {
  if (!selectedTag.value) return []
  
  return users.value
    .filter(u => u.prefs?.some(p => p.tagId == selectedTag.value))
    .map(u => ({
      id: u.id,
      username: u.username || u.name // Fallback por si acaso
    }))
})
watch(selectedTag, () => {
  selectedUsers.value = []
})

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
  startHour: '',
  endHour: '',
})
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
        try {
        await auth.addEvent(event, selectedTag.value, selectedUsers.value)
        show.value = false
        } catch(error) {
            console.error(error)
        }
        
    }
}
</script>

<style scoped>
</style>