<template>
  <v-dialog v-model="show" width="500">
    <v-card
      v-if="event"
      :class="(event.active ? '' : 'event-closed-dialog', 'text-black')"
    >
      <v-img
        v-if="eventImageUrl"
        :src="eventImageUrl"
        height="100"
        cover
        class="align-end text-white"
      >
      </v-img>
      <v-card-title :class="event.active ? '' : 'event-closed-dialog'">
        {{ event.title }}
      </v-card-title>
      <v-card-text class="pa-4">
        Descripció: {{ event.description }}
      </v-card-text>
      <v-card-text> Etiqueta: {{ event.tagName }} </v-card-text>
      <v-card-text>
        Data: {{ formattedDate }} | {{ formattedTime }}
      </v-card-text>
      <v-card-text v-if="event.assists">
        Assistències: {{ event?.assists?.length }} | Pagades:
        {{ getPaidAssists }}
      </v-card-text>
      <v-card-text
        v-if="event.checkNeeds == true && event.foodNeeds.length > 0"
      >
        Necessitats alimentaries de l'esdeveniment:
        {{ event.foodNeeds?.length }}
      </v-card-text>
      <v-card-text v-if="event.attendants.length > 0">
        Encarregats de l'esdeveniment: {{ event.attendants?.length }}
      </v-card-text>
      <v-card-text> Creat per: {{ event.createdBy }} </v-card-text>
      <v-card-text v-if="event.price > 0">
        Preu: {{ event.price }}€
      </v-card-text>
      <v-card-text v-if="event.totalRevenue">
        Recaudació total: {{ event.totalRevenue }}€
      </v-card-text>
      <v-divider />

      <v-card-actions>
        <v-btn
          class="bg-transaction"
          variant="text"
          @click="payEvent"
          icon="mdi-currency-eur"
          :disabled="
            event.active == false || event.price <= 0 || checkUnpaidAssists
          "
        />
        <v-btn
          class=""
          variant="text"
          @click="showEditDialog = true"
          icon="mdi-arrow-u-down-left"
          :disabled="event.active == false"
        />
        <v-btn
          class="bg-error"
          variant="text"
          @click="confirmDelete"
          icon="mdi-delete"
          :disabled="event.active == false"
        />
        <v-spacer></v-spacer>
        <v-btn
          class=""
          variant="text"
          @click="show = false"
          icon="mdi-cancel"
        />
      </v-card-actions>
      <v-dialog v-model="showPayDialog" widht="auto">
        <EventPaymentDialog
          :event="event"
          @closed="
            showPayDialog = false;
            emit('update:modelValue');
          "
        />
      </v-dialog>
      <v-dialog v-model="showEditDialog" width="auto">
        <EventEditDialog
          @closed="
            showEditDialog = false;
            show = false;
          "
          :event="selectedEvent"
        />
      </v-dialog>
      <v-dialog v-model="showDeleteDialog" max-width="400">
        <v-card>
          <v-card-title class="text-h5 text-white bg-error"
            >¿Vols eliminar el event?</v-card-title
          >

          <v-card-text class="pa-4">
            Estàs a punt d'eliminar l'esdeveniment:
            <strong>{{ event?.title }}</strong
            >. <br /><br />
            <span class="text-caption text-error"
              >Esta acció no es pot desfer.</span
            >
          </v-card-text>

          <v-divider></v-divider>

          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              variant="text"
              @click="showDeleteDialog = false"
              :disabled="loading"
              icon="mdi-cancel"
            />
            <v-btn
              color="error"
              variant="elevated"
              :loading="loading"
              @click="executeDelete"
            >
              Eliminar definitivament
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { useAuthStore } from "@/stores/auth";
import EventEditDialog from "@/components/admin-panel/event-panel/EventEditDialog.vue";
import { computed, ref } from "vue";
import EventPaymentDialog from "./EventPaymentDialog.vue";
const showDeleteDialog = ref(false);
const showEditDialog = ref(false);
const showPayDialog = ref(false);
const loading = ref(false);
const auth = useAuthStore();
const props = defineProps({
  modelValue: Boolean,
  event: Object,
});
const selectedEvent = ref(props.event);
const emit = defineEmits(["update:modelValue"]);
const show = computed({
  get: () => props.modelValue,
  set: (value) => emit("update:modelValue", value),
});

const payEvent = (ev) => {
  showPayDialog.value = true;
};

const confirmDelete = () => {
  showDeleteDialog.value = true;
};

const formattedTime = computed(() => {
  return `${props.event.startHour.substring(
    0,
    2
  )}:${props.event.startHour.substring(3, 5)}`;
});

const checkUnpaidAssists = computed(() => {
  const paidAssists = props.event.assists.filter((a) => a.paid != true);
  if (paidAssists.length > 0) return false;
  return true;
});

const getPaidAssists = computed(() => {
  const paidAssists = props.event.assists.filter((a) => a.paid == true);
  return paidAssists.length;
});

//Para mostrar las fechas formateadas del evento. Si es en el mismo dia muestra solo la fecha inicial, si es de varios muestra las 2.
const formattedDate = computed(() => {
  if (props.event.date == props.event.endDate) {
    return `${new Date(props.event.date).toLocaleDateString("ca-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    })}`;
  }
  return `${new Date(props.event.date).toLocaleDateString("ca-ES", {
    day: "2-digit",
    month: "2-digit",
    year: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  })} fins a: ${new Date(props.event.endDate).toLocaleDateString("ca-ES", {
    day: "2-digit",
    month: "2-digit",
    year: "2-digit",
  })}`;
});

const executeDelete = async () => {
  if (!props.event) return;
  loading.value = true;
  try {
    await auth.deleteEvent(props.event.id);
    showDeleteDialog.value = false;
    show.value = false;
  } catch (error) {
    console.error("Error al borrar:", error);
  } finally {
    loading.value = false;
    auth.fetchFallaAdminInfo();
  }
};

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

<style></style>
