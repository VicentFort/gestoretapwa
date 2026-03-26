<template>
    <v-dialog v-model="show" width="500">
                <v-card class="bg-primary pa-2">
                    <v-card-title class="bg-ternary">Afegir event</v-card-title>
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
                            <v-text-field
                            class="text-black"
                            v-model="formattedDate"
                            label="Data d'inici"
                            prepend-inner-icon="mdi-calendar"
                            readonly
                            variant="outlined"
                            @click="dateMenu = true"
                            ></v-text-field>
                            <v-dialog v-model="dateMenu" max-width="340 bg-ternary">
                                <v-card>
                                    <v-date-picker
                                        class="text-black"
                                        v-model="event.date"
                                        title="Selecciona la data"
                                        header="Data d'inici de l'event"
                                        @update:model-value="dateMenu = false"
                                    ></v-date-picker>
                                    <v-card-actions>
                                        <v-spacer></v-spacer>
                                        <v-btn variant="text" class="bg-ternary" @click="dateMenu = false">Tancar</v-btn>
                                    </v-card-actions>
                                </v-card>
                            </v-dialog>
                        </v-col>

                        <v-col cols="12" class="justify-center d-flex">
                            <v-text-field
                            class="text-black"
                            v-model="formattedEndDate"
                            label="Data de fi"
                            prepend-inner-icon="mdi-calendar"
                            readonly
                            variant="outlined"
                            @click="endDateMenu = true"
                         ></v-text-field>
                            <v-dialog v-model="endDateMenu" max-width="340">
                                <v-card>
                                    <v-date-picker
                                        class="text-black"
                                        v-model="event.endDate"
                                        title="Selecciona la data"
                                        header="Data de fi de l'event"
                                        @update:model-value="endDateMenu = false"
                                    ></v-date-picker>
                                    <v-card-actions>
                                        <v-spacer></v-spacer>
                                        <v-btn variant="text" @click="endDateMenu = false">Tancar</v-btn>
                                    </v-card-actions>
                                </v-card>
                            </v-dialog>
                        </v-col>

                        <v-col cols="12">
                            <v-switch
                                v-model="event.publicField"
                                label="Event públic"
                                color="secondary"
                            ></v-switch>
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
                            <v-select
                                v-model="selectedUsers"
                                :items="filterUsers"
                                :disabled="!selectedTag"
                                :hint="!selectedTag ? 'Selecciona una etiqueta primer' : 'Usuaris disponibles'"
                                persistent-hint
                                item-title="username"
                                item-value="id"
                                label="Usuaris disponibles"
                                multiple
                                chips
                                variant="outlined"
                                class="mt-4 bg-primary"
                                >
                                <template v-slot:chip="{ props, item }">
                                    <v-chip
                                    class="bg-primary"
                                    v-bind="props"
                                    :text="item.raw.username" 
                                    ></v-chip>
                                </template>
                                <template v-slot:no-data>
                                    <v-list-item class="bg-primary">
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
                <v-btn class="text-white bg-ternary" type="submit" :disabled="!valid">Crear</v-btn>
                <v-btn class="text-white bg-ternary" variant="text" @click="show = false">Tanca</v-btn>
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
  date: null,
  fallaId: auth.fallaAdminInfo.fallaId,
  startHour: '',
  endHour: '',
  endDate: null,
  open: true,
  createdAt: new Date(),
  createdBy: auth.userInfo.name + ' ' + auth.userInfo.surname
})
const dateMenu = ref(false)
const endDateMenu = ref(false)
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
            if(event.endDate < event.date) { event.endDate = event.date}
            const eventData = await auth.addEvent(event, selectedTag.value, selectedUsers.value)
            await auth.joinEvent(eventData?.id)
            show.value = false
        } catch(error) {
            console.error(error)
        }
        
    }
}
const formattedDate = computed(() => {
  if (!event.date) return ''
  const dateObj = new Date(event.date)
  const offset = dateObj.getTimezoneOffset() * 60000
  const localISO = new Date(dateObj.getTime() - offset).toISOString()
  
  // Extraemos YYYY-MM-DD y HH:mm:ss.SSS
  const [date, timeWithZ] = localISO.split('T')
  const time = timeWithZ.slice(0, 12) 
  return `${date} ${time}`
})

const formattedEndDate = computed(() => {
  if (!event.endDate) return ''
  const dateObj = new Date(event.endDate)
  const offset = dateObj.getTimezoneOffset() * 60000
  const localISO = new Date(dateObj.getTime() - offset).toISOString()
  
  const [date, timeWithZ] = localISO.split('T')
  const time = timeWithZ.slice(0, 12)
  return `${date} ${time}`
})

</script>

<style scoped>
</style>