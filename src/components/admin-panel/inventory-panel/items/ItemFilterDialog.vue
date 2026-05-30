<template>
    <v-container>
        <v-form @submit.prevent="submitForm" ref="form" v-model="valid">
            <v-card>
                <v-card-title class="font-weight-bold">
                Filtrar item de inventari
                </v-card-title>
                <v-row>
                     <v-col cols="12" md="6">
                        <v-text-field label="Nom" v-model="name" />
                    </v-col>
                    <v-col cols="12" md="6">
                        <v-select :items="stores" :item-props="storeProps" label="Magatzems on buscar" v-model="store"/>
                    </v-col>
                    <v-col cols="12" md="6">
                        <v-select :items="itemCategories" label="Categoria" v-model="category"/>
                    </v-col>
                </v-row>
                <v-card-actions>
                    <v-spacer/>
                    <v-btn @click="submitForm" icon="mdi-filter" variant="text"/>
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
import { itemCategories } from '@/stores/backendEnums';
import { computed, ref } from 'vue';


const auth = useAuthStore()

const valid = ref(false)
const form = ref(null)

const name = ref('')
const category = ref('')

const stores = computed(() => {
    return auth.fallaAdminInfo.stores
})

const store = ref(null)

const emit = defineEmits(['update-filter', 'closed'])



const error = ref('')
const showErrorDiag = ref(false)

const submitForm = async () => {
     try {
        let filtered = auth.fallaAdminInfo.inventoryItems.filter(item => {
            const meetsName = name.value != '' ? item.name.includes(name.value) : true
            const meetsCategory = category.value != '' ? item.category.includes(category.value) : true
            const meetsStore = store.value ? item.stocks.some(stock => stock.storeId === store.value.id) : true
            return meetsStore && meetsName && meetsCategory

        })

        emit('update-filter', filtered)
     } catch(err) {
        error.value = err
        showErrorDiag.value = true
     }
}

function storeProps (store) {
    return {
        title: store.name,
        subtitle: store.location,
        value: store
    }
}


</script>