<script setup>
import { useAuthStore } from "@/stores/auth";
import { computed, ref } from "vue";
import { useDisplay } from "vuetify/lib/composables/display";
import ErrorDialog from "@/components/ErrorDialog.vue";
const auth = useAuthStore();
const props = defineProps({
  modelValue: Boolean,
  need: String,
});
const emit = defineEmits(["update:modelValue"]);
const show = computed({
  get: () => props.modelValue,
  set: (value) => emit("update:modelValue", value),
});
const error = ref("");
const showErrorDiag = ref(false);
const mobile = useDisplay();
const deleteNeed = async () => {
  try {
    await auth.deleteNeed(props.need);
    show.value = false;
  } catch (err) {
    error.value = err;
    showErrorDiag.value = true;
  }
};

const titleSize = computed(() => {
  // name.value devuelve 'xs', 'sm', 'md', 'lg', 'xl'
  switch (mobile.value) {
    case "xs":
      return "0.3rem";
    case "sm":
      return "0.5rem";
    case "md":
      return "0.75rem";
    default:
      return "1rem";
  }
});

const exit = () => {
  show.value = false;
};
</script>
<template>
  <v-dialog v-model="show" width="600">
    <v-row>
      <v-col>
        <v-card>
          <v-card-title :style="{ fontSize: titleSize }" class="">
            Eliminar la necessitat alimentària?
          </v-card-title>
          <v-divider></v-divider>
          <v-card-text>
            {{ need.description }}
          </v-card-text>
          <v-divider></v-divider>
          <v-card-actions>
            <v-btn
              color="grey-darken-1"
              variant="text"
              class=""
              @click="deleteNeed"
              icon="mdi-delete"
            />
            <v-btn
              color="grey-darken-1"
              variant="text"
              class=""
              @click="exit"
              icon="mdi-cancel"
            />
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-dialog>
  <ErrorDialog
    @closed="showErrorDiag = false"
    :message="error"
    v-model="showErrorDiag"
  />
</template>

<style scoped></style>
