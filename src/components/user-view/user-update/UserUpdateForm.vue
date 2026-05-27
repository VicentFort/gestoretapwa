<script setup>
import ErrorDialog from '@/components/ErrorDialog.vue';
import { useAuthStore } from '@/stores/auth';
import { ref, computed } from 'vue';

    const auth = useAuthStore()
    const error = ref('')
    const showErrorDiag = ref(false)
    const showSuccessDiag = ref(false)
    const menu = ref(false)

    const uName = ref(auth.userInfo?.name || '')
    const uSurname = ref(auth.userInfo?.surname || '')
    const uBirthday = ref(auth.userInfo?.birthday || new Date())
    const uShowBday = ref(auth.userInfo?.showBday || '')
    const uNickname = ref(auth.userInfo?.nickname || '')
    const selectedFile = ref(null)
    const previewUrl = ref(null)
    const isUploading = ref(false)

    const sendUpdateForm = async () => {
        try {
            await auth.updateUser(uName.value, uSurname.value, uBirthday.value, uShowBday.value, uNickname.value)
            if(selectedFile.value !== null) {
                const formData = new FormData()
                formData.append('pfpImage', selectedFile.value)
                await auth.uploadPfpImage(formData)
            }
            
            showSuccessDiag.value = true
            
        } catch(err) {
            error.value = err
            showErrorDiag.value = true
        }
    }
    const closeError = () => {
        error.value = ''
        showErrorDiag.value = false
    }
    const formattedDate = computed(() => {
        if (!uBirthday.value) return ''
        
        // Convertimos el objeto Date a un string legible
        return new Date(uBirthday.value).toLocaleDateString('ca-ES', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        })
    })

    const onFileChange = (file) => {
        if (!file) {
            previewUrl.value = null
            return
        }
        previewUrl.value = URL.createObjectURL(file)
    }
</script>

<template>
    <v-container>
        <v-form @submit.prevent="sendUpdateForm" class="w-100">
            <v-card class="bg-primary">
                <v-card-title class="bg-ternary">Info de: {{ auth.userInfo.name }}</v-card-title>
                <v-row>
                    <v-col cols="12" md="6">
                        <v-text-field
                        class="text-black"
                        label="Nickname / Malnom"
                        :rules="[v => !!v || 'Nickname necessari']"
                        v-model="uNickname"
                        id="uName"
                        />
                    </v-col>
                    <v-col cols="12" md="6" >
                        <v-switch
                        class="text-black"
                        label="Aniversari públic"
                        v-model="uShowBday"
                        />
                    </v-col>
                </v-row>
                <v-row>
                    <v-col cols="12" md="6">
                        <v-file-input
                            v-model="selectedFile"
                            label="Selecciona la nova imatge de perfil"
                            accept="image/jpeg, image/png"
                            prepend-icon="mdi-camera"
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
                </v-row>
                <v-card-options>
                    <v-btn text="Guarda canvis" class="bg-ternary" type="submit" :disabled="uSurname=='' || uName=='' "></v-btn>
                </v-card-options>
                
               
            </v-card>
            <v-dialog v-model="showSuccessDiag" max-width="400">
                <v-card>
                    <v-card-title class="bg-secondary">Usuari actualitzat</v-card-title>
                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn variant="text" @click="showSuccessDiag=false">Tanca</v-btn>
                    </v-card-actions>
                </v-card>
            </v-dialog>
            <ErrorDialog :message="error" v-model="showErrorDiag" @closed="showErrorDiag=false"/>
        </v-form>        
    </v-container>
</template>

<style>
.v-card{
    border-color: rgb(var(--v-theme-ternary));
    border-width: 10px;
    border-style: solid;
}

</style>