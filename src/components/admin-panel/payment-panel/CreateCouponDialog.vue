<template>
  <v-container>
    <v-form @submit.prevent="submitForm" v-model="valid" ref="form">
      <v-card>
        <v-card-title class="text-h6">Afegir un tiquet</v-card-title>
        <v-row>
          <v-col cols="12" md="6">
            <v-text-field
              label="Nom del tiquet"
              v-model="name"
              :rules="nameRules"
            />
          </v-col>
          <v-col cols="12" md="6">
            <v-select
              :items="mainItems"
              :item-props="itemProps"
              label="Item a bescanviar"
              v-model="selectedItem"
              :rules="itemRules"
            />
          </v-col>
          <v-col cols="12" md="6">
            <v-number-input
              v-model="price"
              label="Preu del tiquet"
              :rules="priceRules"
            />
          </v-col>
        </v-row>
        <v-card-actions>
          <v-spacer />
          <v-btn icon="mdi-content-save" type="submit" :disabled="!valid" />
          <v-btn class="" @click="emit('closed')" icon="mdi-cancel" />
        </v-card-actions>
      </v-card>
    </v-form>
  </v-container>
  <ErrorDialog
    @closed="showErrorDiag = false"
    :message="error"
    v-model="showErrorDiag"
  />
</template>

<script setup>
import { useAuthStore } from "@/stores/auth";
import { itemCategories } from "@/stores/backendEnums";
import { computed, ref } from "vue";
import ErrorDialog from "@/components/ErrorDialog.vue";
const auth = useAuthStore();
const valid = ref(false);
const mainItems = computed(() => {
  return auth.fallaAdminInfo.inventoryItems.filter((item) => {
    return (
      item.category === itemCategories[1] || item.category === itemCategories[4]
    );
  });
});
const form = ref(null);
const emit = defineEmits(["closed"]);
const name = ref("");
const price = ref(0);
const selectedItem = ref(null);

const error = ref("");
const showErrorDiag = ref(false);

const submitForm = async () => {
  try {
    const { valid: formValid } = await form.value.validate();
    if (!formValid) return;
    const request = {
      fallaId: auth.fallaAdminInfo.fallaId,
      itemId: selectedItem.value.id,
      price: price.value,
      name: name.value,
    };
    await auth.createCoupon(request);
    emit("closed");
  } catch (err) {
    error.value = err;
    showErrorDiag.value = true;
  }
};

const nameRules = [
  (name) => {
    if (name) return true;
    return "Insereix un nom per al tiquet";
  },
  (name) => {
    if (name !== "") return true;
    return "El nom no ha de estar buit";
  },
];

const itemRules = [
  (item) => {
    if (item !== null) return true;
    return "Selecciona un item de inventari";
  },
];

const priceRules = [
  (price) => {
    if (price > 0) return true;
    return "Insereix un preu vàlid";
  },
];

function itemProps(item) {
  return {
    title: item.name,
    subtitle: item.category,
    value: item,
  };
}
</script>
