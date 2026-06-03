<template>
  <v-dialog v-model="show" width="500">
    <v-card v-if="user" class="">
      <v-card-title class="text-h5 text-secondary"
        >{{ user.name }} {{ user.surname }}</v-card-title
      >
      <v-card-text class="font-weight-bold"
        >Malnom: {{ showNick() }}</v-card-text
      >
      <v-card-text class="font-weight-bold">
        Correu electrònic: {{ user?.email }}
      </v-card-text>
      <v-card-text class="font-weight-bold"
        >Preferències alimentàries
      </v-card-text>
      <v-list v-if="user.foodNeeds.length > 0" class="">
        <v-list-item v-for="need in user.foodNeeds" :title="'-' + need" />
      </v-list>
      <v-card-text v-else class="font-weight-bold"> Ninguna </v-card-text>
      <v-card-text class="font-weight-bold"
        >Disposicions a events:
      </v-card-text>
      <v-list class="" v-if="user.prefs != null && user.prefs.length > 0">
        <v-list-item
          v-for="pref in user.prefs"
          :key="pref.prefId"
          :title="'-' + pref.tagName"
        />
      </v-list>
      <v-card-text v-else class="font-weight-bold"> Ninguna </v-card-text>
      <v-card-actions>
        <v-btn icon="mdi-cancel" @click="show = false" />
      </v-card-actions>
    </v-card>
    <ErrorDialog
      :message="error"
      v-model="showErrorDiag"
      @closed="showErrorDiag = false"
    />
  </v-dialog>
</template>

<script setup>
import ErrorDialog from "@/components/ErrorDialog.vue";
import { useAuthStore } from "@/stores/auth";
import { computed, ref, reactive } from "vue";

const props = defineProps({
  modelValue: Boolean,
  user: Object,
});
const auth = useAuthStore();

const accessType = ref(props.user.accessType);
const accessTypes = ref(auth.accessTypes);
const error = ref("");
const showErrorDiag = ref(false);
const emit = defineEmits(["update:modelValue"]);
const show = computed({
  get: () => props.modelValue,
  set: (value) => emit("update:modelValue", value),
});
const showNick = () => {
  return props.user.nickname !== null ? props.user.nickname : "-";
};
</script>
