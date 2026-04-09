<template>
    <v-container>
        <v-form @submit.prevent="submitForm" ref="form" v-model="valid">
            <v-card class="bg-primary">
                <v-card-title class="text-primary font-weight-bold bg-ternary">
                    Registrar moviment d'inventari
                </v-card-title>
                <v-card-text class="bg-primary" style="max-height: 70vh; overflow-y: auto;">
                    <v-divider/>
                    <v-card-text class="bg-ternary text-primary">Dades generals</v-card-text>
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
                                lable="Tipus de moviment">
                                </v-select>
                            </v-col>
                            <v-col cols="12" md="6">
                                <v-text-field label="Missatge" v-model="message" variant="outlined">
                                </v-text-field>
                            </v-col>
                        </v-row>
                        <v-divider/>
                        <v-card-text class="bg-ternary text-primary" v-if="selectedType=='Préstec'">Dades de contacte</v-card-text>
                        <v-row v-if="selectedType=='Préstec'">
                            <v-col cols="12" md="6" v-if="selectedType=='Préstec'">
                                <v-select
                                :items="contacts"
                                v-model="selectedContact"
                                label="Contacte">
                                </v-select>
                            </v-col>
                            <v-col cols="12" md="6" v-if="selectedType=='Préstec'">
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
                            <v-col cols="12" md="6" v-if="selectedType=='Préstec'">
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
                    <v-btn variant="submit" icon="mdi-plus" @click="submitForm"></v-btn>
                </v-card-actions>
            </v-card>
        </v-form>
    </v-container>
</template>

<script setup>
import { useAuthStore } from '@/stores/auth';
import { ref, computed } from 'vue';


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

const submitForm = async () => {
    try {
        const {valid: formValid} = await form.value.validate()
        if(!formValid) return
        const inventoryMovement = {
            itemId: selectedItem.value,
            storeId: selectedStore.value,
            amount: amount.value,
            type: selectedType.value,
            message: message.value
        }
        await auth.processMovement(inventoryMovement)
        emit('closed')
    } catch(err) {
        console.error(err)
    }
}

</script>