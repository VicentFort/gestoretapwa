<template>
    <v-container>
        <v-form @submit.prevent="submitForm" ref="form" v-model="valid">
            <v-card>
                <v-card-title class="font-weight-bold">
                Filtrar usuaris
                </v-card-title>
                <v-row>
                     <v-col cols="12" md="6">
                        <v-text-field label="Nom i cognoms" v-model="name" />
                    </v-col>
                    <v-col cols="12" md="6">
                        <v-text-field label="Malnom" v-model="nickname" />
                    </v-col>
                    <v-col cols="12" md="6">
                        <v-select :items="accessTypes" label="Tipus de càrrec" v-model="aType"/>
                    </v-col>
                    <v-col cols="12" md="6">
                        <v-text-field
                        class="text-black"
                        v-model="formattedDate"
                        label="Data de uniò anterior a"
                        prepend-inner-icon="mdi-calendar"
                        readonly
                        variant="outlined"
                        @click="dateMenu = true"
                        ></v-text-field>
                        <v-dialog v-model="dateMenu" max-width="340"a>
                            <v-card>
                                <v-date-picker
                                    class="text-black"
                                    v-model="date"
                                    header="Data de unió"
                                    @update:model-value="dateMenu = false"
                                ></v-date-picker>
                                <v-card-actions>
                                    <v-btn variant="text" class="" @click="dateMenu = false" icon="mdi-cancel"/>
                                </v-card-actions>
                            </v-card>
                        </v-dialog>
                    </v-col>
                    <v-col cols="12" md="6">
                        <v-text-field
                        class="text-black"
                        v-model="formattedBDay"
                        label="Aniversari anterior a"
                        prepend-inner-icon="mdi-calendar"
                        readonly
                        variant="outlined"
                        @click="bDayDateMenu = true"
                        ></v-text-field>
                        <v-dialog v-model="bDayDateMenu" max-width="340"a>
                            <v-card>
                                <v-date-picker
                                    class="text-black"
                                    v-model="birthday"
                                    header="Aniversari"
                                    @update:model-value="bDayDateMenu = false"
                                ></v-date-picker>
                                <v-card-actions>
                                    <v-btn variant="text" class="" @click="bDayDateMenu = false" icon="mdi-cancel"/>
                                </v-card-actions>
                            </v-card>
                        </v-dialog>
                    </v-col>
                </v-row>
                <v-card-actions>
                    <v-btn @click="submitForm" icon="mdi-filter" class="bg-secondary" variant="text"/>
                    <v-btn @click="emit('closed')" icon="mdi-cancel" class="" variant="text"/>
                </v-card-actions>
            </v-card>
        </v-form>

    </v-container>
    <ErrorDialog @closed="showErrorDiag= false" :message="error" v-model="showErrorDiag"/>
</template>

<script setup>

import ErrorDialog from '@/components/ErrorDialog.vue';
import { useAuthStore } from '@/stores/auth';
import { accessTypes } from '@/stores/backendEnums';
import { isManager } from '@/stores/checkAccessType';
import { useDateFormatter } from '@/stores/util';
import { computed, ref } from 'vue';


const auth = useAuthStore()

const valid = ref(false)
const form = ref(null)

const aType = ref(null)
const date = ref(null)
const birthday = ref(null)
const nickname = ref('')
const name = ref('')

const emit = defineEmits(['update-filter', 'closed'])
const {formattedDate: formattedDate} = useDateFormatter(() => date.value)
const {formattedDate: formattedBDay} = useDateFormatter(() => birthday.value)
const dateMenu = ref(false)
const bDayDateMenu = ref(false)


const error = ref('')
const showErrorDiag = ref(false)

const submitForm = async () => {
     try {
        let filtered = auth.fallaAdminInfo.users.filter(user => {
            const meetsAccessType = aType.value != null ? user.accessType === aType.value : true
            const meetsDate = date.value != null ? new Date(user.joinDate) <= new Date(date.value) : true
            const meetsBDay = birthday.value != null ? new Date(user.birthday) <= new Date(birthday.value) : true
            const meetsNickname = nickname.value != '' ? user.nickname.includes(nickname.value) : true
            const meetsName = name.value != '' ? (user.name + " " + user.surname).includes(name.value) : true
            return meetsAccessType && meetsDate && meetsBDay && meetsNickname && meetsName

        })
        emit('update-filter', filtered)
     } catch(err) {
        error.value = err
        showErrorDiag.value = true
     }
}



</script>