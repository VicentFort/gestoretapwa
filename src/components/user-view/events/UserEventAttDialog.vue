<template>
  <v-dialog v-model="show" width="500">
    <v-card v-if="event" :class="event.active ?'' : 'event-closed-dialog'">
      <v-img
        v-if="eventImageUrl"
        :src="eventImageUrl"
        height="100"
        cover
        class="align-end text-white"
      >
      </v-img>
      <v-img
        v-else
        src="@/assets/ic_gestoreta_logo.png"
        height="100"
        cover
        class="align-end text-white"
      />
      <v-card-title
        class="text-h6"
        :class="event.active ?'' : 'event-closed-dialog'"
      >
        Títol: {{ event?.title }}
      </v-card-title>

      <v-card-text class="pa-4"
        >Descripció: {{ event?.description }}</v-card-text
      >

      <v-card-text class="pa-4">Data: {{ formattedDate }}</v-card-text>

      <v-card-text class="pa-4">Hora: {{ formattedTime }}</v-card-text>

      <v-card-text class="pa-4">Etiqueta: {{ event?.tagName }}</v-card-text>

      <v-card-text class="pa-4">Obert al públic: {{ formatPublic() }}</v-card-text>

      <v-card-text class="pa-4" v-if="event.price !== null && event.price > 0">Preu {{ event.price }} €</v-card-text>


      <v-divider></v-divider>

      <v-card-actions>
        <v-btn
          variant="text"
          class=""
          @click="assistEvent"
          :disabled="event.active == false || event.assist"
          icon="mdi-calendar-plus"
        />
        <v-btn
          variant="text"
          @click="deleteAssist"
          :disabled="event.active == false || !event.assist"
          icon="mdi-calendar-remove"
        />

        <v-spacer></v-spacer>
        <v-btn
          variant="text"
          class=""
          @click="show = false"
          icon="mdi-cancel"
        />
      </v-card-actions>
      <ErrorDialog
        :message="error"
        v-model="showErrorDiag"
        @closed="closeError"
      />
    </v-card>
  </v-dialog>
</template>

<script setup>
import { computed, ref } from "vue";
import { useAuthStore } from "@/stores/auth";
import ErrorDialog from "@/components/ErrorDialog.vue";
const auth = useAuthStore();
const props = defineProps({
  modelValue: Boolean,
  event: Object,
});
const emit = defineEmits(["update:modelValue"]);
const show = computed({
  get: () => props.modelValue,
  set: (value) => emit("update:modelValue", value),
});

const formatPublic = () => {
  return props.event.public ? 'si' : 'no'
}

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

const error = ref("");
const showErrorDiag = ref(false);

const closeError = () => {
  error.value = "";
  showErrorDiag.value = false;
};

const assistEvent = async () => {
  try {
    await auth.joinEvent(props.event.id);
    show.value = false;
  } catch (err) {
    error.value = err;
    showErrorDiag.value = true;
  }
};

const deleteAssist = async () => {
  try {
    await auth.deleteAssist(props.event.assist.assistId);
    show.value = false;
  } catch (err) {
    error.value = err;
    showErrorDiag.value = true;
  }
};

//Para mostrar las fechas formateadas del evento. Si es en el mismo dia muestra solo la fecha inicial, si es de varios muestra las 2.
const formattedDate = computed(() => {
  if (props.event.date == props.event.endDate)
    return `${new Date(props.event.date).toLocaleDateString("ca-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "2-digit",
    })}`;
  return `${new Date(props.event.date).toLocaleDateString("ca-ES", {
    day: "2-digit",
    month: "2-digit",
    year: "2-digit",
  })} fins a: ${new Date(props.event.endDate).toLocaleDateString("ca-ES", {
    day: "2-digit",
    month: "2-digit",
    year: "2-digit",
  })}`;
});

const formattedTime = computed(() => {
  return `${props.event.startHour.substring(
    0,
    2
  )}:${props.event.startHour.substring(3, 5)}`;
});

const formattedOpen = computed(() => {
  return props.event.active ? "Obert" : "Tancat";
});
</script>

<style></style>
