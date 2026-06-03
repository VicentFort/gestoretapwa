<template>
    <v-form ref="form" v-model="valid" @submit.prevent="submitForm">
        <v-card>
            <v-card-title class="text-h6">Filtrar moviments de inventari</v-card-title>
            <v-row>
                <v-col cols="12" md="6">
                    <v-select 
                    :items="movementTypes" 
                    label="Tipus de moviment" 
                    v-model="type"
                    />
                </v-col>
                <v-col cols="12" md="6">
                    <v-select 
                    :items="loanStates" 
                    label="Estat del préstec" 
                    v-model="state"
                    />
                </v-col>
                <v-col cols="12" md="6">
                    <v-text-field
                    class="text-secondary"
                    v-model="formattedDate"
                    label="Data anterior a"
                    prepend-inner-icon="mdi-calendar"
                    readonly
                    variant="outlined"
                    @click="dateMenu = true"
                    ></v-text-field>
                    <v-dialog v-model="dateMenu" max-width="340" a>
                    <v-card>
                        <v-date-picker
                        class="text-secondary"
                        v-model="date"
                        header="Data del moviment"
                        @update:model-value="dateMenu = false"
                        ></v-date-picker>
                        <v-card-actions>
                        <v-btn
                            variant="text"
                            class=""
                            @click="dateMenu = false"
                            icon="mdi-cancel"
                        />
                        </v-card-actions>
                    </v-card>
                    </v-dialog>
                </v-col>
            </v-row>
            <v-card-actions>
                 <v-btn
                class="text-white"
                type="text"
                @click="emptyFields"
                icon="mdi-cancel"
                />
                <v-btn
                class="text-white"
                type="submit"
                :disabled="!valid"
                icon="mdi-calendar-search"
                />
            </v-card-actions>
        </v-card>
    </v-form>
</template>

<script setup>
import { useAuthStore } from '@/stores/auth';
import { loanStates, movementTypes } from '@/stores/backendEnums';
import { formatDate, useDateFormatter } from '@/stores/util';
import { ref } from 'vue';


const auth = useAuthStore()
const emit = defineEmits(["update-filter"]);
const form = ref(null)
const valid = ref(false)

const dateMenu = ref(false)
const date = ref(null)
const {formattedDate: formattedDate} = useDateFormatter(() => date.value)

const type = ref('')
const state = ref('')

const emptyFields = () => {
    type.value = ''
    state.value = ''
    emit('update-filter', null)
}

const submitForm = () => {
    let filtered = !auth.fallaAdminInfo.inventoryMovements ? [] : auth.fallaAdminInfo.inventoryMovements.filter(mov => {
        const meetsType = type.value !== '' ? mov.movementType === type.value : true
    
        const meetsState = state.value !== '' ? (mov.loan !== null && mov.movementType == 'Préstec' ? mov.loan.state == state.value : false) : true
        const meetsDate = date.value !== null ? new Date(mov.date) <= new Date(date.value) : true 
        
        return meetsType && meetsState && meetsDate
    })
    emit('update-filter', filtered)
}

</script>