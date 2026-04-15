<template>
    <v-container>
        <v-form @submit.prevent="submitForm" ref="form" v-model="valid">
            <v-card class="bg-primary">
                <v-card-title class="text-primary font-weight-bold bg-ternary">
                    Registrar moviment d'inventari
                </v-card-title>
                <v-card-text class="bg-primary" style="max-height: 70vh; overflow-y: auto;">
                    <v-divider/>
                    <v-card-text class="text-primary bg-ternary">Dades generals</v-card-text>
                        <v-row>
                            <v-col cols="12" md="6">
                                <v-select label="Magatzem" :items="stores"
                                v-model="selectedStore" item-title="name" item-value="id"
                                >          
                                </v-select>
                            </v-col>
                            <v-col cols="12" md="6">
                                <v-select label="Item" :items="inventoryItems"
                                v-model="selectedItem" item-title="name" item-value="id"
                                >        
                                </v-select>
                            </v-col>
                            <v-col cols="12" md="6">
                                <v-number-input label="Quantitat" v-model="amount" :min="1" :step="1">
                                </v-number-input>
                            </v-col>
                            <v-col cols="12" md="6">
                                <v-select
                                :items="movementTypes"
                                v-model="selectedType"
                                label="Tipus de moviment">
                                </v-select>
                            </v-col>
                            <v-col cols="12" md="6">
                                <v-text-field label="Missatge" v-model="message" variant="outlined">
                                </v-text-field>
                            </v-col>
                        </v-row>
                        <v-divider/>
                        <v-card-text class="text-primary bg-ternary" v-if="selectedType=='Préstec'">Dades de contacte</v-card-text>
                        <v-row v-if="selectedType=='Prèstec'">
                            <v-col cols="12" md="6" v-if="selectedType=='Prèstec'">
                                <v-select
                                :items="contacts"
                                item-title="name"
                                item-value="id"
                                v-model="selectedContact"
                                label="Contacte">
                                </v-select>
                            </v-col>
                            <v-col cols="12" md="6" v-if="selectedType=='Prèstec'">
                                <v-text-field
                                    class="text-black"
                                    v-model="adquistionDate"
                                    label="Data de préstec"
                                    prepend-inner-icon="mdi-calendar"
                                    :rules="[d => !!d || 'Data de préstec necessària']"
                                    readonly
                                    variant="outlined"
                                    @click="adquisitonDateMenu = true"
                                ></v-text-field>
                                <v-dialog v-model="adquisitonDateMenu" max-width="340">
                                    <v-card>
                                        <v-date-picker
                                            class="text-black"
                                            v-model="adquistionDate"
                                            title="Selecciona la data"
                                            header="Data de préstec"
                                            @update:model-value="adquisitonDateMenu = false"
                                        ></v-date-picker>
                                        <v-card-actions>
                                            <v-btn variant="text" @click="adquisitonDateMenu = false">Tancar</v-btn>
                                        </v-card-actions>
                                    </v-card>
                                </v-dialog>
                            </v-col>
                            <v-col cols="12" md="6" v-if="selectedType=='Prèstec'">
                                <v-text-field
                                    class="text-black"
                                    v-model="idealReturnDate"
                                    label="Data de retorn"
                                    prepend-inner-icon="mdi-calendar"
                                    :rules="[d => !!d || 'Data de retorn necessària']"
                                    readonly
                                    variant="outlined"
                                    @click="idealReturnDateMenu = true"
                                ></v-text-field>
                                <v-dialog v-model="idealReturnDateMenu" max-width="340">
                                    <v-card>
                                        <v-date-picker
                                            class="text-black"
                                            v-model="idealReturnDate"
                                            title="Selecciona la data"
                                            header="Data de retorn"
                                            @update:model-value="idealReturnDateMenu = false"
                                        ></v-date-picker>
                                        <v-card-actions>
                                            <v-btn variant="text" @click="idealReturnDateMenu = false">Tancar</v-btn>
                                            
                                        </v-card-actions>
                                    </v-card>
                                </v-dialog>
                            </v-col>
                        </v-row>
                </v-card-text>
                
                <v-card-actions>
                    <v-btn class="bg-ternary" @click="emit('closed')" icon="mdi-cancel"></v-btn>
                    <v-btn class="bg-ternary" variant="submit" icon="mdi-plus" @click="submitForm"></v-btn>
                </v-card-actions>
            </v-card>
        </v-form>
    </v-container>
    <ErrorDialog :message="error" v-model="showErrorDiag" @closed="showErrorDiag=false"></ErrorDialog>
</template>

<script setup>
import ErrorDialog from '@/components/ErrorDialog.vue';
import { useAuthStore } from '@/stores/auth';
import { ref, computed, reactive } from 'vue';
import RegisterLoanEmail from '../notifications-emails/RegisterLoanEmail.vue';
import { render } from '@vue-email/render';
import emailjs from '@emailjs/browser';


const auth = useAuthStore()
const form = ref(null)
const valid = ref(false)

const emit = defineEmits(['closed'])

const adquisitonDateMenu = ref(false)
const idealReturnDateMenu = ref(false)

const inventoryItems = computed(() => auth.fallaAdminInfo?.inventoryItems.filter(item => {
    return item.enabled==true
}) || []) 
const stores = computed(() => auth.fallaAdminInfo?.stores.filter(store => {
    return store.enabled==true
}) || []) 
const contacts = computed(() => auth.fallaAdminInfo?.contacts || [])
const movementTypes = auth.movementTypes


const selectedStore = ref('')
const selectedItem = ref('')
const amount = ref(1)
const selectedType = ref('')
const message = ref('')
const selectedContact = ref(null)
const adquistionDate = ref('')
const idealReturnDate = ref('')

const error = ref('')
const showErrorDiag = ref(false)
const formData = reactive({
    user_name:'Vicent Fort',
    user_email:'vicenteforttronch@gmail.com',
    message:'XD'
})



const submitForm = async () => {
    try {
        const {valid: formValid} = await form.value.validate()
        if(!formValid) return
        const inventoryMovement = {
            itemId: selectedItem.value,
            storeId: selectedStore.value,
            amount: amount.value,
            type: selectedType.value,
            message: message.value,

            contactId: selectedContact.value,
            adquisitionDate: adquistionDate.value,
            idealReturnDate: idealReturnDate.value
        }
        
        await auth.processMovement(inventoryMovement)
        if(inventoryMovement.type=='Prèstec') {


                        
            const serviceId = process.env.VUE_APP_EMAIL_JS_SERVICE_ID
            const templateId = process.env.VUE_APP_EMAIL_JS_TEMPLATE1_ID
            const key = process.env.VUE_APP_EMAIL_JS_KEY

            console.log(formData)

            await emailjs.send(
                serviceId,
                templateId,
                formData,
                key
            )
        }
    
        emit('closed')
    } catch(err) {
        console.error(err)
        showErrorDiag.value = true
        error.value= err
    }
}

</script>