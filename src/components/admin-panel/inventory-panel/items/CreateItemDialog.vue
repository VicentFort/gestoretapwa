<template>
  <v-container>
    <v-form @submit.prevent="submitForm" ref="form" v-model="valid">
      <v-card>
        <v-card-title class="font-weight-bold">
          Crear un nou Item
        </v-card-title>
        <v-col>
          <v-row rows="12" md="6">
            <v-text-field label="Nom" v-model="name" type="text" required>
            </v-text-field>
          </v-row>
          <v-row rows="12" md="6">
            <v-text-field
              label="Descripció"
              v-model="description"
              type="text"
              required
            >
            </v-text-field>
          </v-row>
          <v-row rows="12" md="6">
            <v-select
              :items="categories"
              v-model="selectedCategory"
              label="Categoria"
            >
            </v-select>
          </v-row>
        </v-col>
        <v-card-actions>
          <v-spacer />

          <v-btn
            type="submit"
            :disabled="
              description == '' || name == '' || selectedCategory == ''
            "
            icon="mdi-content-save"
          />
          <v-btn class="align-left" icon="mdi-cancel" @click="emit('closed')" />
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
import ErrorDialog from "@/components/ErrorDialog.vue";
import { useAuthStore } from "@/stores/auth";
import { itemCategories } from "@/stores/backendEnums";
import { ref, defineEmits } from "vue";

const auth = useAuthStore();

const valid = ref(false);
const form = ref(null);

const name = ref("");
const description = ref("");

const emit = defineEmits(["closed"]);

const error = ref("");
const showErrorDiag = ref(false);

const selectedCategory = ref("");
const categories = itemCategories;

const submitForm = async () => {
  try {
    const { valid: formValid } = await form.value.validate();
    if (!formValid) return;
    const newItem = {
      name: name.value,
      description: description.value,
      category: selectedCategory.value,
    };
    await auth.createNewInventoryItem(newItem);
    emit("closed");
  } catch (err) {
    error.value = err;
    showErrorDiag.value = true;
  }
};
</script>
