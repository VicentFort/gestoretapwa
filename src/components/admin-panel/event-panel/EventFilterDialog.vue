<template>
  <v-form ref="form" v-model="valid" @submit.prevent="submitForm">
    <v-card>
      <v-card-title class="text-h6">Filtrar esdeveniments: </v-card-title>
      <v-row>
        <v-col cols="12" class="justify-center d-flex">
          <v-text-field
            class="text-secondary"
            v-model="formattedDate"
            label="Inicien abans de:"
            prepend-inner-icon="mdi-calendar"
            readonly
            variant="outlined"
            @click="dateMenu = true"
          ></v-text-field>
          <v-dialog v-model="dateMenu" max-width="340" a>
            <v-card>
              <v-date-picker
                class="text-secondary"
                v-model="date"
                title="Selecciona la data"
                header="Data d'inici de l'event"
                @update:model-value="dateMenu = false"
              ></v-date-picker>
              <v-card-actions>

                <v-btn
                  variant="text"
                  class=""
                  @click="dateMenu = false"
                  icon="mdi-cancel"
                />
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-col>
        <v-col cols="12" class="justify-center d-flex">
          <v-text-field
            class="text-secondary"
            v-model="formattedEndDate"
            label="Acaben abans de:"
            prepend-inner-icon="mdi-calendar"
            readonly
            variant="outlined"
            @click="endDateMenu = true"
          ></v-text-field>
          <v-dialog v-model="endDateMenu" max-width="340">
            <v-card>
              <v-date-picker
                class="text-secondary"
                v-model="endDate"
                title="Selecciona la data"
                header="Data d'inici de l'event"
                @update:model-value="endDateMenu = false"
              ></v-date-picker>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn
                  variant="text"
                  class=""
                  @click="endDateMenu = false"
                  icon="mdi-cancel"
                />
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
            label="Etiquetes"
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
        <v-btn
          class="text-white"
          type="text"
          @click="emptyFields"
          icon="mdi-cancel"
        />
        <v-btn
          class="text-white"
          type="submit"
          :disabled="!valid"
          icon="mdi-calendar-search"
        />
      </v-card-actions>
    </v-card>
  </v-form>
</template>

<script setup>
import { useAuthStore } from "@/stores/auth";
import { ref, computed } from "vue";


const emit = defineEmits(["update-filter", "toggle-closed"]); // <--- Añadimos el nuevo emit


const valid = ref(false);
const dateMenu = ref(false);
const endDateMenu = ref(false);
const auth = useAuthStore();
const tags = ref(auth.fallaAdminInfo.tags);

const date = ref("");
const endDate = ref("");
const tag = ref(null);
const maxPrice = ref(null);

const submitForm = () => {
  let filtered = auth.fallaAdminInfo.events?.filter((event) => {
    const meetsMaxPrice =
      maxPrice.value !== null && maxPrice.value !== ""
        ? event.price <= maxPrice.value
        : true;

    // Comprobamos que date.value tenga contenido real
    const hasStartDate = date.value && date.value !== "";
    const meetsDate = hasStartDate
      ? new Date(event.date) <= new Date(date.value)
      : true;

    const hasEndDate = endDate.value && endDate.value !== "";
    const meetsEndDate = hasEndDate
      ? new Date(event.endDate) <= new Date(endDate.value)
      : true;


    const meetsTag = tag.value ? event.tagName == tag.value : true;

    return meetsMaxPrice && meetsDate && meetsEndDate && meetsTag;
  });
  emit("update-filter", filtered);
};
const emptyFields = () => {
  date.value = null;
  endDate.value = null;
  maxPrice.value = null;
  tag.value = null;
  emit("toggle-closed", false);
  emit("update-filter", null);
};

const formattedDate = computed(() => {
  if (!date?.value) return "";
  const dateObj = new Date(date?.value);
  const offset = dateObj.getTimezoneOffset() * 60000;
  const localISO = new Date(dateObj.getTime() - offset).toISOString();

  // Extraemos YYYY-MM-DD y HH:mm:ss.SSS
  const [fDate, timeWithZ] = localISO.split("T");
  const time = timeWithZ.slice(0, 0);
  return `${fDate} ${time}`;
});

const formattedEndDate = computed(() => {
  if (!endDate?.value) return "";
  const dateObj = new Date(endDate?.value);
  const offset = dateObj.getTimezoneOffset() * 60000;
  const localISO = new Date(dateObj.getTime() - offset).toISOString();

  // Extraemos YYYY-MM-DD y HH:mm:ss.SSS
  const [fDate, timeWithZ] = localISO.split("T");
  const time = timeWithZ.slice(0, 0);
  return `${fDate} ${time}`;
});
</script>
