<template>
    <v-container v-if="auth.userInfo?.eventTagPrefs && auth.userInfo?.fallaInfo">
        <v-card class="bg-primary">
            <v-card-title class="bg-ternary">Disposicions d'encarregat:</v-card-title>
            <v-list class="bg-primary text-primary">
                <v-list-item
                    v-for="pref in auth.userInfo?.eventTagPrefs"
                    class="text-black"
                    :key="pref.prefId"
                    :title="pref.tagName"
                    @click="openInfo(pref)"
                />
            </v-list>
            <v-card-actions class="justify-center">
                <v-btn @click="openCreateForm" class="bg-ternary" :disabled="!fallaTags">Afegir disposició</v-btn>
            </v-card-actions>
            <v-dialog v-model="isCreateOpen">
                <AddPrefDialog v-model="isCreateOpen" />
            </v-dialog>
            <v-dialog v-model="isInfoOpen">
                <DeletePrefDialog v-model="isInfoOpen" :pref="selectedPreference"/>
            </v-dialog>
        </v-card>
    </v-container>
</template>

<script setup>
import { useAuthStore } from '@/stores/auth';
import { ref } from 'vue';
import DeletePrefDialog from './DeletePrefDialog.vue';
import AddPrefDialog from './AddPrefDialog.vue';
const auth = useAuthStore()
const fallaTags = ref(auth.userInfo?.fallaInfo?.tags || [])
const isInfoOpen = ref(false)
const isCreateOpen = ref(false)
const selectedPreference = ref(null)
const openInfo = (pref) => {
    isInfoOpen.value=true
    selectedPreference.value=pref
}
const openCreateForm = () => {
    isCreateOpen.value = true
}
</script>
