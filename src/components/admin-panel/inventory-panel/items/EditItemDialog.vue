<template>
  <v-container>
    <v-form @submit.prevent="submitForm" ref="form" v-model="valid">
      <v-card>
        <v-card-title class="font-weight-bold">
          Editant el item: {{ item.name }}
        </v-card-title>
        <v-col>
          <v-row rows="12" md="6">
            <v-text-field
              label="Nom"
              v-model="localItem.name"
              type="text"
              required
            ></v-text-field>
          </v-row>
          <v-row rows="12" md="6">
            <v-text-field
              label="Descripció"
              v-model="localItem.description"
              type="text"
              required
            ></v-text-field>
          </v-row>
          <v-row rows="12" md="6">
            <v-select
              :items="categories"
              v-model="localItem.category"
              label="Categoria"
            ></v-select>
          </v-row>
        </v-col>
        <v-card-actions>
          <v-spacer />
          <v-btn type="submit" icon="mdi-content-save-edit" />
          <v-btn icon="mdi-cancel" @click="emit('closed')" />
        </v-card-actions>
      </v-card>
    </v-form>
  </v-container>
</template>

<script setup>
import { useAuthStore } from "@/stores/auth";
import { itemCategories } from "@/stores/backendEnums";
import { ref, watch, defineEmits } from "vue";

const auth = useAuthStore();

const categories = itemCategories;

const valid = ref(false);
const form = ref(null);

const props = defineProps({
  modelView: Boolean,
  item: Object,
});

const localItem = ref({ ...props.item });

watch(
  () => props.item,
  (newVal) => {
    localItem.value = { ...newVal };
  },
  { deep: true }
);

const emit = defineEmits(["closed"]);

const submitForm = async () => {
  try {
    const { valid: formValid } = await form.value.validate();
    if (!formValid) return;

    const updatedItem = {
      itemId: props.item.id,
      name: localItem.value.name,
      description: localItem.value.description,
      itemCategory: localItem.value.category,
    };
    await auth.updateInventoryItem(updatedItem);
    emit("closed");
  } catch (err) {
    console.error(err);
  }
};
</script>

<style scoped>
@media (max-width: 600px) {
  :deep(thead) {
    display: none;
  }

  .responsive-tr {
    display: flex;
    flex-direction: column;
    padding: 12px;
    border-bottom: 8px solid #eeeeee;
    height: auto !important;
    margin-bottom: 8px;
  }

  .responsive-td {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border: none !important;
    padding: 8px 0 !important;
    min-height: 40px;
  }

  .responsive-td::before {
    content: attr(data-label);
    font-weight: bold;
    text-transform: uppercase;
    font-size: 0.7rem;
    color: #757575;
  }
}
</style>
