<script setup>
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
    const sendUpdateForm = async () => {
        try {
            await auth.updateUser(uName.value, uSurname.value, uBirthday.value, uShowBday.value)
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
                        label="Nom d'usuari"
                        :rules="[v => !!v || 'Nom necessari']"
                        v-model="uName"
                        id="uName"
                        />
                    </v-col>
                    <v-col cols="12" md="6">
                        <v-text-field 
                        class="text-black"
                        label="Cognoms"
                        v-model="uSurname"
                        :rules="[v => !!v || 'Cognoms necessaris']"
                        id="uName"
                        />
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
                                class="text-black"
                                v-model="uBirthday"
                                title="Selecciona la data"
                                header="Aniversari"
                                @update:model-value="menu = false"
                            ></v-date-picker>
                            <v-card-actions>
                                <v-spacer></v-spacer>
                                <v-btn variant="text" @click="menu = false">Tancar</v-btn>
                            </v-card-actions>
                            </v-card>
                        </v-dialog>
                    </v-col>
                    <v-col cols="12" md="6" >
                        <v-switch
                        class="text-black"
                        label="Aniversari públic"
                        v-model="uShowBday"
                        />
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
            <v-dialog v-model=showErrorDiag width=400px>
                <v-card>
                <v-card-title class="text-h5 text-white bg-error">Error</v-card-title>
                    
                    <v-card-text class="pa-4">
                    {{ error }}
                    </v-card-text>
                    
                    <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="error" variant="text" @click="closeError">
                        Tanca
                    </v-btn>
                </v-card-actions>
            </v-card>
            </v-dialog>
        </v-form>        
    </v-container>
</template>

<style>
.v-card{
    border-color: #FF7F50;
    border-width: 10px;
    border-style: solid;
}

</style>