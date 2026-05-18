<template>
    <v-dialog v-model="show" width="500">
        <v-card v-if="user"  class="bg-primary">
            <v-card-title class="text-h5 text-black bg-ternary">Nom i cognoms: {{ user.name }} {{ user.surname }}</v-card-title>
            <v-card-text class="pa-4">Aniversari: {{ user.birthday }}</v-card-text>
            <v-card-text class="pa-4" v-if="user.nickname">Malnom: {{ user.nickname }}</v-card-text>
            <v-card-text class="pa-4">Faller desde: {{ user.joinDate }}</v-card-text>
            <v-select v-if="auth.userInfo.accessType=='Superusuari'"
            :items="accessTypes"
            v-model="accessType"
            title="Modificar el permís d'accés">
            </v-select>
            <v-card v-if="user?.foodNeeds.length>0" class="bg-primary border-0">
                <v-card-text class="pa-4">Necessitats: </v-card-text>
                <v-list class="bg-primary">
                    <v-list-item
                    v-for="need in user.foodNeeds"
                    :key="need.foodNeedId"
                    :title= "'-'+need.description"
                    />
                </v-list>
            </v-card>
            <v-card v-if="user?.prefs.length>0" class="bg-primary border-0">
                <v-card-text class="pa-4">Disposicions a events: </v-card-text>
                <v-list class="bg-primary">
                    <v-list-item
                    v-for="pref in user.prefs"
                    :key="pref.prefId"
                    :title= "'-'+pref.tagName"
                    />
                </v-list>
            </v-card>
            <v-divider></v-divider>

        <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn class="bg-secondary" variant="text" @click="show = false">
            Tanca
            </v-btn>
            <v-btn class="bg-secondary" variant="text" @click="editAccessType">Guarda canvis</v-btn>
        </v-card-actions>
        </v-card>
        <ErrorDialog :message="error" v-model="showErrorDiag" @closed="showErrorDiag=false"/>
     </v-dialog>
</template>

<script setup>
import ErrorDialog from '@/components/ErrorDialog.vue';
import { useAuthStore } from '@/stores/auth';
import { computed, ref,reactive } from 'vue';

const props = defineProps({
    modelValue: Boolean,
    user: Object
})
const auth = useAuthStore()

const accessType = ref(props.user.accessType)
const accessTypes = ref(auth.accessTypes)
const error = ref('')
const showErrorDiag = ref(false)
const emit = defineEmits(['update:modelValue'])
const show = computed({
    get: () => props.modelValue,
    set: (value) => emit('update:modelValue', value)
})
const editAccessType = async () => {
    try {
        const accessRequest = {
            accessType: accessType.value,
            userId: props.user.id
        }
        await auth.editAccessType(accessRequest)
    } catch(err) {
        error.value=err
        showErrorDiag.value = true
    }

}

</script>