<template>
    <v-container>
        <v-form @submit.prevent="submitForm" ref="form" v-model="valid">
            <v-card>
                <v-card-title class="font-weight-bold">
                Filtrar esdeveniments
                </v-card-title>
                <v-col>
                    <v-row rows="12" md="6">
                        <v-select :items="paymentTypes" :item-props="paymentProps" label="Tipus de pagament" v-model="type"/>
                    </v-row>
                    <v-row rows="12" md="6">
                        <v-text-field
                        class="text-black"
                        v-model="formattedDate"
                        label="Pagaments realitzats abans de: "
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
                                    title="Selecciona la data"
                                    header="Data dels pagaments"
                                    @update:model-value="dateMenu = false"
                                ></v-date-picker>
                                <v-card-actions>
                                    <v-btn variant="text" class="" @click="dateMenu = false" icon="mdi-cancel"/>
                                </v-card-actions>
                            </v-card>
                        </v-dialog>
                    </v-row>
                    <v-row rows="12" md="6">
                        <v-text-field label="Imports majors que: " v-model="price" type="input"/>
                    </v-row>
                    <v-row rows="12" md="6">
                        <v-select :items="managers" label="Gestors de la falla" v-model="manager" :item-props="managerProps"/>
                    </v-row>
                </v-col>
                <v-card-actions>
                    <v-spacer/>
                    <v-btn @click="submitForm" icon="mdi-filter" variant="text"/>
                    <v-btn @click="emit('closed')" icon="mdi-cancel"  variant="text"/>
                </v-card-actions>
            </v-card>
        </v-form>

    </v-container>
    <ErrorDialog @closed="showErrorDiag= false" :message="error" v-model="showErrorDiag"/>
</template>

<script setup>

import ErrorDialog from '@/components/ErrorDialog.vue';
import { useAuthStore } from '@/stores/auth';
import { paymentTypes } from '@/stores/backendEnums';
import { isManager } from '@/stores/checkAccessType';
import { useDateFormatter } from '@/stores/util';
import { computed, ref } from 'vue';


const auth = useAuthStore()

const valid = ref(false)
const form = ref(null)

const type = ref(null)
const date = ref(null)
const manager = ref(null)
const price = ref(0)
const emit = defineEmits(['update-filter', 'closed'])
const {formattedDate: formattedDate} = useDateFormatter(() => date.value)
const dateMenu = ref(false)

const managers = computed(() => {
    const managers = auth.fallaAdminInfo.users.filter( user => {
        return isManager(user.accessType)==true
    })
    return managers;
})

const error = ref('')
const showErrorDiag = ref(false)

const submitForm = async () => {
     try {
        let filtered = auth.fallaAdminInfo.payments.filter(payment => {
            const meetsType = type.value != null ? payment.type === type.value.value : true
            const meetsDate = date.value != null ? new Date(payment.date) <= new Date(date.value) : true
            const meetsPrice = price.value > 0 ? payment.price >= price.value : true
            const meetsManager = manager.value != null ? payment.manager === manager.value.id : true
            return meetsType && meetsDate && meetsPrice && meetsManager

        })
        emit('update-filter', filtered)
     } catch(err) {
        error.value = err
        showErrorDiag.value = true
     }
}

function paymentProps (item) {
    return {
        title: item.name,
        value: item
    }
}
function managerProps (item) {
    return {
        title: item.name + " " + item.surname,
        subtitile: item.accessType,
        value: item
    }
}

</script>