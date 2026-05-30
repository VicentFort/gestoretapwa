<template>
  <v-container>
    <v-form @submit.prevent="submitForm" ref="form" v-model="valid">
      <v-card>
        <v-card-title class="font-weight-bold">
          Editant el magatzem: {{ store.name }}
        </v-card-title>
        <v-col>
          <v-row rows="12" md="6">
            <v-text-field
              label="Nom"
              v-model="localStore.name"
              type="text"
              required
            >
            </v-text-field>
          </v-row>
          <v-row rows="12" md="6">
            <v-text-field
              label="Ubicació"
              v-model="localStore.location"
              type="text"
              required
            >
            </v-text-field>
          </v-row>
        </v-col>
        <v-card-actions>
          <v-spacer />
          <v-btn class="" type="submit" icon="mdi-content-save-edit" />
          <v-btn class="align-left" icon="mdi-cancel" @click="emit('closed')" />
        </v-card-actions>
      </v-card>
    </v-form>
  </v-container>
  <v-dialog v-model="showError">
    <ErrorDialog
      @closed="showError = false"
      :message="error"
      v-model="showError"
    />
  </v-dialog>
</template>

<script setup>
import ErrorDialog from "@/components/ErrorDialog.vue";
import { useAuthStore } from "@/stores/auth";
import { ref, watch } from "vue";

const auth = useAuthStore();

const form = ref(null);
const valid = ref(false);

const showError = ref(false);
const error = ref("");

const props = defineProps({
  modelView: Boolean,
  store: Object,
});

const localStore = ref({ ...props.store });

watch(
  () => props.store,
  (newVal) => {
    localStore.value = { ...newVal };
  },
  { deep: true }
);

const emit = defineEmits(["closed"]);

const submitForm = async () => {
  try {
    const { valid: formValid } = await form.value.validate();
    if (!formValid) return;

    const updatedStore = {
      storeId: props.store.id,
      name: localStore.value.name,
      location: localStore.value.location,
    };
    await auth.updateStore(updatedStore);
    emit("closed");
  } catch (err) {
    error.value = err;
    showError.value = true;
  }
};
</script>
