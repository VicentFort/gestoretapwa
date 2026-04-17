<template>
    <v-card class="bg-primary">
        <v-card-title class="bg-ternary">Filtrar events: </v-card-title>
        <v-form ref="form" v-model="valid" @submit.prevent="submitForm">
            <v-row>
                <v-col cols="12" class="justify-center d-flex">
                    <v-text-field
                    class="text-black"
                    v-model="formattedDate"
                    label="Inicien abans de:"
                    prepend-inner-icon="mdi-calendar"
                    readonly
                    variant="outlined"
                    @click="dateMenu = true"
                    ></v-text-field>
                    <v-dialog v-model="dateMenu" max-width="340"a>
                        <v-card>
                            <v-date-picker
                                class="text-black"
                                v-model="date"
                                title="Selecciona la data"
                                header="Data d'inici de l'event"
                                @update:model-value="dateMenu = false"
                            ></v-date-picker>
                            <v-card-actions>
                                <v-btn 
                                    :icon="showClosed ? 'mdi-eye' : 'mdi-eye-off'" 
                                    :class="showClosed ? 'bg-secondary' : 'bg-grey-lighten-1'"
                                    @click="toggleClosed"
                                    title="Mostrar tancats"
                                ></v-btn>
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
                    label="Acaben abans de:"
                    prepend-inner-icon="mdi-calendar"
                    readonly
                    variant="outlined"
                    @click="endDateMenu = true"
                    ></v-text-field>
                    <v-dialog v-model="endDateMenu"max-width="340">
                        <v-card>
                            <v-date-picker
                                class="text-black"
                                v-model="endDate"
                                title="Selecciona la data"
                                header="Data d'inici de l'event"
                                @update:model-value="endDateMenu = false"
                            ></v-date-picker>
                            <v-card-actions>
                                <v-spacer></v-spacer>
                                <v-btn variant="text" class="bg-ternary" @click="endDateMenu = false">Tancar</v-btn>
                            </v-card-actions>
                        </v-card>
                    </v-dialog>
                </v-col>
                <v-col cols="12" md="6">
                    <v-select
                        v-model="tag"
                        :items="tags"
                        item-title="name"
                        item-value="name"
                        persistent-hint
                        variant="outlined"
                    ></v-select>
                </v-col>
                <v-col cols="12" md="6">
                    <v-text-field 
                        v-model.number="maxPrice"
                        label="Preu màxim"
                        type="number"
                        prefix="€"
                    ></v-text-field>
                </v-col>
            </v-row>
            <v-card-actions>
                <v-btn class="text-white bg-ternary" type="text" @click="emptyFields">Buidar</v-btn>
                <v-btn class="text-white bg-ternary" type="submit" :disabled="!valid">Filtrar</v-btn>
                <v-btn 
                :icon="showClosed ? 'mdi-filter' : 'mdi-clock-outline'" 
                :class="showClosed ? 'bg-secondary' : 'bg-ternary'"
                @click="toggleClosed"
                ></v-btn>
                <span class="ml-2 text-caption">
                {{ showClosed ? 'Mostrant tots' : 'Només oberts' }}
                </span>
            </v-card-actions>
        </v-form>
    </v-card>
</template>

<script setup>
import { useAuthStore } from '@/stores/auth';
import { ref, computed } from 'vue';



const showClosed = ref(false);

const emit = defineEmits(['update-filter', 'toggle-closed']); // <--- Añadimos el nuevo emit

const toggleClosed = () => {
    showClosed.value = !showClosed.value;
    emit('toggle-closed', showClosed.value); // Avisamos al padre del cambio
};
const valid = ref(false)
const dateMenu = ref(false)
const endDateMenu = ref(false)
const auth = useAuthStore()
const tags = ref(auth.userInfo.fallaInfo?.tags)

const date = ref('')
const endDate = ref('')
const tag = ref(null)
const maxPrice = ref(null)


const submitForm = () => {
    let filtered = auth.userInfo.events?.filter(event => {
        const meetsMaxPrice = (maxPrice.value !== null && maxPrice.value !== '') 
            ? event.price <= maxPrice.value 
            : true;

        // Comprobamos que date.value tenga contenido real
        const hasStartDate = date.value && date.value !== '';
        const meetsDate = hasStartDate 
            ? new Date(event.date) <= new Date(date.value) 
            : true;

        const hasEndDate = endDate.value && endDate.value !== '';
        const meetsEndDate = hasEndDate 
            ? new Date(event.endDate) <= new Date(endDate.value) 
            : true;

        const meetsTag = tag.value ? event.tagName == tag.value : true;

        return meetsMaxPrice && meetsDate && meetsEndDate && meetsTag;
    });
    emit('update-filter', filtered);
}
const emptyFields = () => {
    date.value = null
    endDate.value = null
    maxPrice.value = null
    tag.value = null
    showClosed.value = false;
    emit('toggle-closed', false);
    emit('update-filter', [...auth.userInfo.events]);

}



const formattedDate = computed(() => {
  if (!date?.value) return ''
  const dateObj = new Date(date?.value)
  const offset = dateObj.getTimezoneOffset() * 60000
  const localISO = new Date(dateObj.getTime() - offset).toISOString()
  
  // Extraemos YYYY-MM-DD y HH:mm:ss.SSS
  const [fDate, timeWithZ] = localISO.split('T')
  const time = timeWithZ.slice(0,0) 
  return `${fDate} ${time}`
})

const formattedEndDate = computed(() => {
  if (!endDate?.value) return ''
  const dateObj = new Date(endDate?.value)
  const offset = dateObj.getTimezoneOffset() * 60000
  const localISO = new Date(dateObj.getTime() - offset).toISOString()
  
  // Extraemos YYYY-MM-DD y HH:mm:ss.SSS
  const [fDate, timeWithZ] = localISO.split('T')
  const time = timeWithZ.slice(0,0) 
  return `${fDate} ${time}`
})

</script>