<template>
    <v-container>
        <v-form @submit.prevent="submitForm" ref="form" v-model="valid" width="auto">
            <v-card>
                <v-card-title>
                        Modificant la informació de la falla: {{ auth.fallaAdminInfo.name }}
                </v-card-title>
                <v-row>
                    <v-col cols="12" md="6">
                        <v-file-input
                        v-model="selectedFile"
                        label="Selecciona la nova imatge de perfil"
                        accept="image/jpeg, image/png"
                        prepend-icon="mdi-camera"
                        class="pa-2"
                        variant="filled"
                        :show-size="1024"
                        @update:model-value="onFileChange"
                        ></v-file-input>
                        <v-expand-transition>
                            <div v-if="previewUrl" class="my-4 text-center">
                                <p class="text-caption text-grey">Vista prèvia:</p>
                                <v-avatar size="120">
                                <v-img :src="previewUrl" cover></v-img>
                                </v-avatar>
                            </div>
                        </v-expand-transition>
                    </v-col>
                    <v-col cols="12" md="6">
                        <v-textarea
                        label="Descripció de la falla"
                        v-model="description"
                        />
                    </v-col>
                    <v-col cols="12" md="6">
                        <v-checkbox
                        label="Acceptar sol·licituds"
                        v-model="openRequests"
                        />
                    </v-col>
                </v-row>
                <v-card-actions>
                    <v-spacer/>
                    <v-btn type="submit" :disabled="!valid" icon="mdi-content-save-edit"/>
                    <v-btn icon="mdi-cancel" @click="emit('closed')"/>
                </v-card-actions>
            </v-card>
        </v-form>
    </v-container>
    <ErrorDialog :message="error" v-model="showErrorDiag" @closed="showErrorDiag=false"/>

</template>

<script setup>
import { useAuthStore } from '@/stores/auth';
import { ref } from 'vue';
import ErrorDialog from '../ErrorDialog.vue';


const auth = useAuthStore()
const form = ref(null)
const valid = ref(false)
const selectedFile = ref(null)
const previewUrl = ref(false)

const description = ref(auth.fallaAdminInfo?.description || '')
const openRequests = ref(auth.fallaAdminInfo?.openRequests || true)

const error = ref('')
const showErrorDiag = ref(false)

const emit = defineEmits(['closed'])

const submitForm = async () => {
    try {
        const { valid: formValid } = await form.value.validate();
        if(!formValid) return
    


        const req = {
            id: auth.fallaAdminInfo.fallaId,
            description: description.value,
            openRequests: openRequests.value
        }

        if(selectedFile.value !== null) {
            await auth.updateFallaShield(selectedFile.value, auth.fallaAdminInfo.fallaId);
        }
        await auth.updateFalla(req)
        emit('closed')
    } catch(err) {
        error.value = err
        showErrorDiag.value = false
    }
}

const onFileChange = (file) => {
  if (!file) {
    previewUrl.value = null;
    return;
  }
  previewUrl.value = URL.createObjectURL(file);
};

</script>