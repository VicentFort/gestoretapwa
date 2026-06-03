<template>
    <v-list class="bg-transparent pa-0" lines="two">
    <v-list-item
      v-for="ad in ads"
      :key="ad.id"
      class="mb-2 falla-item"
      rounded="lg"
      @click="selectFalla(ad)"
    >
      <template #prepend>
        <div class="shield-wrapper">
          <v-img
            v-if="ad.shield"
            :src="shieldSrc(ad.shield)"
            :alt="`Escut de ${ad.name}`"
            cover
            class="shield-img"
          />
          <v-icon v-else color="ternary" size="28">mdi-shield-outline</v-icon>
        </div>
      </template>

      <v-list-item-title class="font-serif text-h6 text-secondary">
        {{ ad.name }}
      </v-list-item-title>

      <v-list-item-subtitle class="text-caption text-medium-emphasis">
        {{ foundationLabel(ad.creationDate) }}
      </v-list-item-subtitle>

      <template #append>
        <v-chip
          size="small"
          variant="tonal"
          color="ternary"
          prepend-icon="mdi-account-group"
        >
          {{ ad.memberCount }}
        </v-chip>
      </template>
    </v-list-item>
  </v-list>
  <v-dialog v-model="showDetailsDiag" min-width="200">
    <FallaAdDialog :falla="selectedFalla" @closed="showDetailsDiag=false;"/>
  </v-dialog>
</template>

<script setup>
import { useAuthStore } from '@/stores/auth';
import { shieldSrc, foundationLabel } from '@/stores/util';
import { computed, ref } from 'vue';
import FallaAdDialog from './FallaAdDialog.vue';

const auth = useAuthStore()
const showAll = ref(false)
const ads = computed(() => {
    if(!auth.userInfo?.fallaAds) return []
    if(showAll.value == true) {
        return auth.userInfo.fallaAds.sort((a,b) => a.id - b.id)
    }
    return auth.userInfo.fallaAds.filter(ad => ad.openRequests == true).sort((a,b) => a.id - b.id)

})

const selectedFalla = ref(null)
const showDetailsDiag = ref(false)

defineEmits(['closed']);

const selectFalla = (falla) => {
    selectedFalla.value = falla
    showDetailsDiag.value = true
}
</script>

<style scoped>
.falla-item {
  background-color: #FFFFFF;
  border: 1px solid rgba(45, 62, 80, 0.08);
  transition: border-color 0.2s ease, transform 0.2s ease;
}
.falla-item:hover {
  border-color: rgba(227, 93, 51, 0.25);
}

.shield-wrapper {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  border: 1px solid rgba(45, 62, 80, 0.08);
  background-color: #FDFCF8;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  margin-right: 12px;
}
.shield-img {
  width: 100%;
  height: 100%;
}
</style>