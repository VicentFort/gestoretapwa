<template>
  <v-form ref="form" v-model="valid" @submit.prevent="submitForm">
    <v-card>
      <v-card-title class="text-h6">Editar esdeveniment</v-card-title>
      <v-row>
        <v-col cols="12">
          <v-text-field
            v-model="localEvent.title"
            :counter="100"
            label="Títol"
            required
          ></v-text-field>
        </v-col>
        <v-col cols="12">
          <v-textarea
            v-model="localEvent.description"
            label="Descripció"
            rows="3"
            required
          ></v-textarea>
        </v-col>

        <v-col cols="12" class="justify-center d-flex">
          <v-text-field
            class="text-secondary"
            v-model="formattedStartDate"
            label="Data d'inici"
            prepend-inner-icon="mdi-calendar"
            readonly
            variant="outlined"
            @click="dateMenu = true"
          ></v-text-field>
          <v-dialog v-model="dateMenu" max-width="340 ">
            <v-card>
              <v-date-picker
                class="text-secondary"
                v-model="localEvent.date"
                :min="new Date()"
                title="Selecciona la data"
                header="Data d'inici de l'event"
                @update:model-value="dateMenu = false"
              ></v-date-picker>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn
                  variant="text"
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
            label="Data de fi"
            prepend-inner-icon="mdi-calendar"
            readonly
            variant="outlined"
            @click="endDateMenu = true"
          ></v-text-field>
          <v-dialog v-model="endDateMenu" max-width="340">
            <v-card>
              <v-date-picker
                class="text-secondary"
                :min="new Date()"
                v-model="localEvent.endDate"
                title="Selecciona la data"
                header="Data de fi de l'event"
                @update:model-value="endDateMenu = false"
              ></v-date-picker>
              <v-card-actions>
                <v-spacer></v-spacer>
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
            v-model="localEvent.startHour"
            label="Hora d'inici"
          />
        </v-col>
        <v-col cols="12" md="6">
          <v-text-field
            type="time"
            v-model="localEvent.endHour"
            label="Hora de fí"
          />
        </v-col>

        <v-col cols="12" md="6">
          <v-switch
            v-model="localEvent.publicField"
            label="Event públic"
          ></v-switch>
        </v-col>

        <v-col cols="12" md="6">
          <v-switch
            v-model="localEvent.checkNeeds"
            label="Event amb preferències alimentàries"
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
            persistent-hint
            variant="outlined"
          ></v-select>
        </v-col>
        <v-col cols="12" md="6">
          <v-select
            v-model="localEvent.attendants"
            :items="filterUsers"
            item-title="name"
            item-value="id"
            multiple
            return-object
            :value-comparator="(a, b) => (a?.id || a) === (b?.id || b)"
            label="Membres disponibles"
            variant="outlined"
            chips
            closable-chips
          >
            <template v-slot:no-data>
              <v-list-item class="">
                <v-list-item-title>
                  No hi ha membres disponibles per a l'etiqueta "{{
                    selectedTag?.name
                  }}"
                </v-list-item-title>
              </v-list-item>
            </template>
          </v-select>
        </v-col>
        <v-col cols="12" md="6">
          <v-text-field
            v-model.number="localEvent.price"
            label="Preu"
            type="number"
            prefix="€"
          ></v-text-field>
        </v-col>

        <v-col cols="12" md="6">
          <v-text-field
            v-model.number="localEvent.maxPeople"
            label="Aforament"
            type="number"
          ></v-text-field>
        </v-col>
        <v-col cols="12" md="6">
          <v-col cols="12" md="6">
            <v-file-input
              v-model="selectedFile"
              label="Selecciona la nova imatge de perfil"
              accept="image/jpeg, image/png"
              prepend-icon="mdi-camera"
              variant="filled"
              :show-size="1024"
            ></v-file-input>
          </v-col>
        </v-col>
      </v-row>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn type="submit" :disabled="!valid" icon="mdi-calendar-edit" />
        <v-btn variant="text" @click="emit('closed')" icon="mdi-cancel" />
      </v-card-actions>
    </v-card>
  </v-form>
  <ErrorDialog
    :message="error"
    v-model="showErrorDiag"
    @closed="showErrorDiag = false"
  />
</template>

<script setup>
import { useAuthStore } from "@/stores/auth";
import { computed, ref, watch } from "vue";
import ErrorDialog from "@/components/ErrorDialog.vue";
import { fileToBase64, useDateFormatter } from "@/stores/util";
import { locale } from "core-js";

const auth = useAuthStore();

const dateMenu = ref(false);
const endDateMenu = ref(false);

const valid = ref(false);
const form = ref(null);

const props = defineProps({
  modelView: Boolean,
  event: Object,
});
const selectedFile = ref(null);
const localEvent = ref({
  ...props.event,
  attendants: Array.isArray(props.event.attendants)
    ? props.event.attendants.map((a) => ({
        id: a.id,
        name: `${a.name} ${a.surname}`.trim(),
      }))
    : [],
});
watch(
  () => props.event.id,
  (newId, oldId) => {
    if (newId !== oldId) {
      localEvent.value = {
        ...props.event,
        attendants: Array.isArray(props.event.attendants)
          ? [...props.event.attendants]
          : [],
      };
    }
  },
  { deep: false }
);

const users = ref(auth.fallaAdminInfo.users);
const tags = ref(auth.fallaAdminInfo.tags);
const selectedTag = ref({
  id: localEvent.value.tagId,
  name: localEvent.value.tagName,
});
const filterUsers = computed(() => {
  if (!selectedTag.value) return [];

  const currentTagId =
    typeof selectedTag.value === "object"
      ? selectedTag.value.id
      : selectedTag.value;

  return users.value
    .filter((u) => u.prefs?.some((p) => p.tagId === currentTagId))
    .map((u) => ({
      id: u.id,
      name: `${u.name} ${u.surname}`.trim(), // Limpiamos espacios
    }));
});

watch(selectedTag, (newTag) => {
  if (newTag !== props.event.tagId) {
    localEvent.value.attendants = [];
  }
});
const emit = defineEmits(["update:modelValue", "closed"]);
const show = computed({
  get: () => props.modelValue,
  set: (value) => emit("update:modelValue", value),
});

const error = ref("");
const showErrorDiag = ref(false);

const submitForm = async () => {
  try {
    const { valid: formValid } = await form.value.validate();
    if(!formValid) return
    let img = null;
    if (selectedFile.value) {
      img = await fileToBase64(selectedFile.value);
    }
    let send = null;
    if (img) {
      send = img[1];
    }
    if (isValid) {
      const eventUpdate = {
        eventId: props.event.id,
        title: localEvent.value.title,
        publicField: localEvent.value.public,
        price: localEvent.value.price,
        description: localEvent.value.description,
        maxPeople: localEvent.value.maxPeople,
        date: props.event.date,
        tagId: localEvent.value.tagId,
        startHour: localEvent.value.startHour,
        endHour: localEvent.value.endHour,
        endDate: localEvent.value.endDate,
        active: localEvent.value.active,
        checkNeeds: localEvent.value.checkNeeds,
        attendantIds: localEvent.value.attendants.map((a) => a.id),
        image: send,
      };
      await auth.updateEvent(eventUpdate);
      emit("closed");
    }
  } catch (err) {
    error.value = err;
    showErrorDiag.value = true;
  }
};

const { formattedDate: formattedStartDate } = useDateFormatter(
  () => props.event.date
);
const { formattedDate: formattedEndDate } = useDateFormatter(
  () => props.event.endDate
);
const eventImageUrl = computed(() => {
  if (props.event?.image) {
    if (props.event.image.startsWith("data:")) {
      return props.event.image;
    }
    // Si el backend te devuelve los bytes limpios en Base64, le pones el prefijo tú
    return `data:image/jpeg;base64,${props.event.image}`;
  }
  return null;
});
</script>
