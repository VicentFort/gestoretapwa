<script setup>
import { computed, ref } from 'vue';
import { useAuthStore } from '@/stores/auth';
import TagInfo from './TagInfo.vue';
import TagCreateDialog from './TagCreateDialog.vue';

const auth = useAuthStore()
const isDetailsOpen = ref(false);
const isCreateOpen = ref(false)
const selectedTag = ref(null);

const orderedTags = computed(() => {
    let base = [...(auth.fallaAdminInfo.tags) || []]
     return base.sort((a, b) => {
        const nameA = a.name || '';
        const nameB = b.name || '';
        return nameA.localeCompare(nameB);
    });
})

const openDetails = (tag) => {
  selectedTag.value = tag;
  isDetailsOpen.value = true;
};

const openCreateTag = () => {
    isCreateOpen.value = true
}
</script>

<template>
    <v-container>
        <v-card class="bg-primary">
            <v-card-title class='bg-ternary'>
                Llistat d'etiquetes d'events
            </v-card-title>
            <v-list class="bg-primary text-primary">
                <v-list-item 
                    v-for="tag in orderedTags" 
                    :key="tag.id"
                    :title="tag.name"
                    link 
                    @click="openDetails(tag)"
                >
            </v-list-item>
            </v-list>
            <v-divider></v-divider>


            <v-dialog v-model="isDetailsOpen" width="auto">
                <TagInfo v-model="isDetailsOpen" :tag="selectedTag"/>
            </v-dialog>
            <v-dialog v-model="isCreateOpen" width="auto">
                <TagCreateDialog v-model="isCreateOpen"/>
            </v-dialog>
            <v-card-actions class="justify-center">
               <v-btn class="justify-center bg-ternary" type="text" @click='openCreateTag'>Crar Etiqueta</v-btn> 
            </v-card-actions>
        </v-card>
    </v-container>
</template>
<style>

</style>