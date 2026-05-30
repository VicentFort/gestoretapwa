<template>
        <v-form @submit.prevent="submitForm" ref="form" v-model="valid" width="auto">
            <v-card>
                <v-card-title  class="text-h6">Crear usuari</v-card-title>
                <v-row>
                    <v-col cols="12" md="6">
                        <v-text-field
                            v-model="email"
                            type="email"
                            label="Correu electrònic"
                            required
                        ></v-text-field>
                    </v-col>
                    <v-col cols="12" md="6">
                        <v-text-field
                            v-model="password"
                            type="password"
                            label="Contrasenya"
                            required
                        ></v-text-field>
                    </v-col>
                    <v-col cols="12" md="6">
                        <v-text-field
                            v-model="name"
                            type="text"
                            label="Nom"
                            required
                        ></v-text-field>
                    </v-col>
                    <v-col cols="12" md="6">
                        <v-text-field
                            v-model="nickname"
                            type="text"
                            label="Malnom"
                            required
                        ></v-text-field>
                    </v-col>
                
                    <v-col cols="12" md="6">
                        <v-text-filed
                            v-model="nickname"
                            type="text"
                            label="Malnom"
                            required
                        ></v-text-filed>
                    </v-col>
                    <v-col></v-col>
                    <v-col cols="12" md="6">
                        <v-text-field
                            v-model="surname"
                            type="text"
                            label="Cognoms"
                            required
                        ></v-text-field>
                    </v-col>
                    <v-col cols="12" class="py-0"> 
                        <v-text-field
                            class="text-black"
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
                                class="text-black text-h6"
                                v-model="birthday"
                                picker-date="initialPickerDate"
                                title="Selecciona la data"
                                header="Aniversari"
                                @update:model-value="menu = false"
                            ></v-date-picker>
                            <v-card-actions>
                                <v-spacer></v-spacer>
                                <v-btn variant="text" class="" @click="menu = false" icon="mdi-cancel"/>
                            </v-card-actions>
                            </v-card>
                        </v-dialog>
                    </v-col>
                    <v-col cols="12" md="6">
                        <v-switch label="Aniversari públic" v-model="showBday">
                            
                        </v-switch>
                    </v-col>
                </v-row>
                <v-card-actions>
                    <v-btn type="submit" class="" :disabled="name=='' || surname=='' || email == '' || password=='' || !email.includes('@') || email.endsWith('@')" icon="mdi-account-plus"/>
                </v-card-actions>

            </v-card>
        </v-form>
        <ErrorDialog @closed="showErrorDiag=false" :message="error" v-model="showErrorDiag"/>
</template>

<script setup>
import router from '@/router';
import { useAuthStore } from '@/stores/auth';
import ErrorDialog from './ErrorDialog.vue';
import { ref, computed } from 'vue';

const error = ref('')
const menu = ref(false)
const showErrorDiag = ref(false)
const closeError = () => {
    error.value = ''
    showErrorDiag.value = false
}
const targetYear = new Date().getFullYear - 18;
const initialPickerDate = ref(`${targetYear}-01`);

const formattedDate = computed(() => {
        if (!birthday.value) return ''
        
        // Convertimos el objeto Date a un string legible
        return new Date(birthday.value).toLocaleDateString('ca-ES', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        })
    })
const auth = useAuthStore()
const form = ref(null)
const valid = ref(false)
const email = ref('')
const password = ref('')
const name = ref('')
const surname = ref('')
const nickname = ref('')
const fallaId = ref(1)
const birthday = ref(new Date())
const showBday = ref(false)
const accessType = ref(false)
const submitForm = async () => {
    try {
        const { valid: formValid } = await form.value.validate()
        if (!formValid) return
        const user = {
            name: name.value,
            surname: surname.value,
            nickanme: nickname.value,
            fallaId: 1,
            birthday: birthday.value,
            showBday: showBday.value,
            email: email.value,
            password: password.value,
            accessType: 'Representatiu',
            creationDate: new Date()
        }
        await auth.createUser(user)
        await auth.login(user.email, user.password)
        router.push("/user")
    } catch(err) {
        error.value= err
        showErrorDiag.value = true
    }
}
</script>