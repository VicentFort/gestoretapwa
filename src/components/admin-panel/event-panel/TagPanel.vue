<script setup>
import { ref } from 'vue';
import { useAuthStore } from '@/stores/auth';
import TagInfo from './TagInfo.vue';
import TagCreateDialog from './TagCreateDialog.vue';

const auth = useAuthStore()
const isDetailsOpen = ref(false);
const isCreateOpen = ref(false)
const selectedTag = ref(null);

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
        <v-card>
            <v-card-title class='bg-ternary'>
                Llistat d'etiquetes d'events
            </v-card-title>
            <v-list>
                <v-list-item 
                    v-for="tag in auth.fallaAdminInfo.tags" 
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
               <v-btn class="justify-center bg-secondary" type="text" @click='openCreateTag'>Crar Etiqueta</v-btn> 
            </v-card-actions>
        </v-card>
    </v-container>
</template>