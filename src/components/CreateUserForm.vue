<template>
    <v-container>
        <v-form @submit.prevent="submitForm" ref="form" v-model="valid">
            <v-card class="pa-5">
                <v-card-title clasS="bg-ternary">Crear usuari</v-card-title>
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
                            v-model="surname"
                            type="text"
                            label="Cognoms"
                            required
                        ></v-text-field>
                    </v-col>
                    <v-col cols="12" class="justify-center d-flex">
                            <v-date-picker
                                v-model="birthday"
                                color="secondary"
                                title="Data de naixement"
                                width="100%"
                            ></v-date-picker>
                    </v-col>
                    <v-col cols="12" md="6">
                        <v-switch label="Aniversari públic" v-model="showBday">
                            
                        </v-switch>
                    </v-col>
                </v-row>
                <v-card-actions>
                    <v-btn type="submit" class="bg-secondary" :disabled="name=='' || surname=='' || email == '' || password=='' || !email.includes('@') || email.endsWith('@')">Crear usuari</v-btn>
                </v-card-actions>
            </v-card>
        </v-form>
    </v-container>
    <v-dialog v-model=showErrorDiag width=400px>
                <v-card>
                <v-card-title class="text-h5 text-white bg-error">Error</v-card-title>
                    
                    <v-card-text class="pa-4">
                    {{ error }}
                    </v-card-text>
                    
                    <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="error" variant="text" @click="closeError" >
                        Tanca
                    </v-btn>
                </v-card-actions>
            </v-card>
            </v-dialog>
</template>

<script setup>
import router from '@/router';
import { useAuthStore } from '@/stores/auth';
import { ref } from 'vue';

const error = ref('')
const showErrorDiag = ref(false)
const closeError = () => {
    error.value = ''
    showErrorDiag.value = false
}
const auth = useAuthStore()
const form = ref(null)
const valid = ref(false)
const email = ref('')
const password = ref('')
const name = ref('')
const surname = ref('')
const fallaId = ref(1)
const birthday = ref(new Date())
const showBday = ref(false)
const adminAccess = ref(false)
const submitForm = async () => {
    try {
        const { valid: formValid } = await form.value.validate()
        if (!formValid) return
        const user = {
            name: name.value,
            surname: surname.value,
            fallaId: 1,
            birthday: birthday.value,
            showBday: showBday.value,
            email: email.value,
            password: password.value,
            adminAccess: false
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