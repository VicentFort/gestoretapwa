<template>
  <v-form ref="form" v-model="valid" @submit.prevent="submitForm">
    <v-card>
      <v-card-title class="text-h6">Afegir esdeveniment</v-card-title>
      <v-row>
        <v-col cols="12">
          <v-text-field
            v-model="event.title"
            :counter="100"
            label="Títol"
            :rules="[(v) => !!v || 'Títol necessari']"
            required
          ></v-text-field>
        </v-col>
        <v-col cols="12">
          <v-textarea
            v-model="event.description"
            label="Descripció"
            :rules="[(v) => !!v || 'Descripció necessària']"
            rows="3"
            required
          ></v-textarea>
        </v-col>

        <v-col cols="12" class="justify-center d-flex">
          <v-text-field
            class="text-black"
            :model-value="formattedStartDate"
            label="Data d'inici"
            prepend-inner-icon="mdi-calendar"
            readonly
            :rules="[(d) => !!d || 'Data d\'inici necessària']"
            variant="outlined"
            @click="dateMenu = true"
          ></v-text-field>
          <v-dialog v-model="dateMenu" max-width="340">
            <v-card>
              <v-date-picker
                class="text-black"
                :min="new Date()"
                v-model="event.date"
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
            class="text-black"
            v-model="formattedEndDate"
            label="Data de fi"
            prepend-inner-icon="mdi-calendar"
            :rules="[(d) => !!d || 'Data de fi necessària']"
            readonly
            variant="outlined"
            @click="endDateMenu = true"
          ></v-text-field>
          <v-dialog v-model="endDateMenu" max-width="340">
            <v-card>
              <v-date-picker
                class="text-black"
                :min="new Date()"
                v-model="event.endDate"
                title="Selecciona la data"
                header="Data de fi de l'event"
                @update:model-value="endDateMenu = false"
              ></v-date-picker>
              <v-card-actions>
                <v-btn
                  variant="text"
                  @click="endDateMenu = false"
                  icon="mdi-cancel"
                />
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-col>
        <v-col cols="12" md="6">
          <v-text-field
            type="time"
            v-model="event.startHour"
            :rules="[(h) => !!h || 'Hora d\'inici necessària']"
            label="Hora d'inici"
          />
        </v-col>
        <v-col cols="12" md="6">
          <v-text-field
            type="time"
            v-model="event.endHour"
            :rules="[(h) => !!h || 'Hora de fi necessària']"
            label="Hora de fí"
          />
        </v-col>

        <v-col cols="12" md="6">
          <v-switch v-model="event.publicField" label="Event públic"></v-switch>
        </v-col>

        <v-col cols="12" md="6">
          <v-switch
            v-model="event.checkNeeds"
            label="Event amb necessitats alimentàries"
          >
          </v-switch>
        </v-col>

        <v-col cols="12" md="6">
          <v-select
            v-model="selectedTag"
            :items="tags"
            item-title="name"
            item-value="id"
            label="Selecciona una etiqueta"
            :rules="[(v) => !!v || 'Has de seleccionar una etiqueta']"
            persistent-hint
            variant="outlined"
          ></v-select>
        </v-col>
        <v-col cols="12" md="6">
          <v-select
            v-model="selectedUsers"
            :items="filterUsers"
            :disabled="!selectedTag"
            :hint="
              !selectedTag
                ? 'Selecciona una etiqueta primer'
                : 'Usuaris disponibles'
            "
            persistent-hint
            item-title="name"
            item-value="id"
            label="Usuaris disponibles"
            multiple
            chips
            variant="outlined"
            class="mt-4"
          >
            <template v-slot:chip="{ props, item }">
              <v-chip class="" v-bind="props" :text="item.name"></v-chip>
            </template>
            <template v-slot:no-data>
              <v-list-item class="">
                <v-list-item-title>
                  No hi ha usuaris disponibles per a l'etiqueta "{{
                    selectedTag?.name
                  }}"
                </v-list-item-title>
              </v-list-item>
            </template>
          </v-select>
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
        <v-col cols="12" md="6">
          <v-file-input
            v-model="selectedFile"
            label="Selecciona imatge per a l'esdeveniment"
            accept="image/jpeg, image/png"
            prepend-icon="mdi-camera"
            variant="filled"
            :show-size="1024"
          ></v-file-input>
        </v-col>
      </v-row>

      <v-card-actions>
        <v-btn type="submit" :disabled="!valid" icon="mdi-calendar-plus" />
        <v-btn @click="emit('closed')" icon="mdi-cancel" />
      </v-card-actions>
    </v-card>
  </v-form>
</template>

<script setup>
import { useAuthStore } from "@/stores/auth";
import { fileToBase64, useDateFormatter } from "@/stores/util";
import { computed, reactive, ref, toRef, watch } from "vue";

const auth = useAuthStore();
const users = ref(auth.fallaAdminInfo.users);
const tags = ref(auth.fallaAdminInfo.tags);
const selectedTag = ref(null);
const selectedFile = ref(null);
const selectedUsers = ref([]);
const filterUsers = computed(() => {
  if (!selectedTag.value) return [];

  return users.value
    .filter((u) => u.prefs?.some((p) => p.tagId == selectedTag.value))
    .map((u) => ({
      id: u.id,
      name: u.name, // Fallback por si acaso
    }));
});
watch(selectedTag, () => {
  selectedUsers.value = [];
});
const valid = ref(false);
const form = ref(null);

const dateMenu = ref(false);
const endDateMenu = ref(false);
const props = defineProps({
  modelValue: Boolean,
});
const emit = defineEmits(["update:modelValue", "closed"]);
const show = computed({
  get: () => props.modelValue,
  set: (value) => emit("update:modelValue", value),
});

const submitForm = async () => {
  const { valid: isValid } = await form.value.validate();
  if (isValid) {
    try {
      if (event.endDate < event.date) {
        event.endDate = event.date;
      }
      if (selectedFile.value) {
        event.eventImage = await fileToBase64(selectedFile.value);
      }
      const eventData = await auth.addEvent(
        event,
        selectedTag.value,
        selectedUsers.value
      );
      await auth.joinEvent(eventData?.id);
      emit("closed");
    } catch (error) {
      console.error(error);
    }
  }
};

const event = reactive({
  title: "",
  publicField: true,
  description: "",
  price: 0,
  maxPeople: 0,
  date: new Date(),
  fallaId: auth.fallaAdminInfo.fallaId,
  startHour: "",
  endHour: "",
  endDate: new Date(),
  createdAt: new Date(),
  createdBy: auth.userInfo.name + " " + auth.userInfo.surname,
  checkNeeds: false,
  eventImage: null,
});
const { formattedDate: formattedStartDate } = useDateFormatter(
  () => event.date
);

const { formattedDate: formattedEndDate } = useDateFormatter(
  () => event.endDate
);
</script>

<style scoped></style>
