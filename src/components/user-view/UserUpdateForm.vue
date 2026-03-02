<script setup>
import { useAuthStore } from '@/stores/auth';
import { ref, computed } from 'vue';

    const auth = useAuthStore()
    const menu = ref(false)
    const valid = ref(false)
    const uName = ref(auth.userInfo?.name || '')
    const uSurname = ref(auth.userInfo?.surname || '')
    const uBirthday = ref(auth.userInfo?.birthday || new Date())
    const uShowBday = ref(auth.userInfo?.showBday || '')
    const sendUpdateForm = () => {
        auth.updateUser(uName.value, uSurname.value, uBirthday.value, uShowBday.value)
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
</script>

<template>
    <v-container>
        <v-form @submit.prevent="sendUpdateForm" v-model="valid" theme="form" class="w-100">
            <v-card>
                <v-card-title class="bg-ternary">Info de: {{ auth.userInfo.name }}</v-card-title>
                <v-row>
                    <v-col cols="12" md="6">
                        <v-text-field 
                        label="Nom d'usuari"
                        v-model="uName"
                        id="uName"
                        />
                    </v-col>
                    <v-col cols="12" md="6">
                        <v-text-field 
                        label="Cognoms"
                        v-model="uSurname"
                        id="uName"
                        />
                    </v-col>
                    <v-col cols="12" class="py-0"> 
                        <v-text-field
                            v-model="formattedDate"
                            label="Data d'aniversari"
                            prepend-inner-icon="mdi-calendar"
                            readonly
                            variant="outlined"
                            @click="menu = true"
                        ></v-text-field>

                        <v-dialog v-model="menu" max-width="340">
                            <v-card>
                            <v-date-picker
                                v-model="uBirthday"
                                title="Selecciona la data"
                                header="Aniversari"
                                @update:model-value="menu = false"
                            ></v-date-picker>
                            <v-card-actions>
                                <v-spacer></v-spacer>
                                <v-btn variant="text" color="primary" @click="menu = false">Tancar</v-btn>
                            </v-card-actions>
                            </v-card>
                        </v-dialog>
                    </v-col>
                    <v-col cols="12" md="6" >
                        <v-switch
                        label="Aniversari públic"
                        v-model="uShowBday"
                        />
                    </v-col>
                </v-row>
                <v-card-options>
                    <v-btn text="Guarda canvis" class="bg-secondary" @click=sendUpdateForm type="submit"></v-btn>
                </v-card-options>
               
            </v-card>
        </v-form>        
    </v-container>
</template>

<style scoped>
</style>