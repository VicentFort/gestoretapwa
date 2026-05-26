<template>
    <v-container>
        <v-form @submit.prevent="submitForm" ref="form" v-model="valid">
            <v-card class="bg-primary">
                <v-card-title class="text-primary font-weight-bold bg-ternary">
                Pagar esdeveniment {{ event.title }}
                </v-card-title>
            <v-col>
                <v-row rows="12" md="6">
                    <v-select :items="userAssist" :item-props="assistProps" v-model="user"/>
                </v-row>
            </v-col>
            <v-card-actions>
                <v-btn @click="emit('closed')" icon="mdi-cancel" color="ternary"/>
                <v-btn @click="submitForm" icon="mdi-plus" color="ternary" :disabled="!user"/>
            </v-card-actions>  
            </v-card>
        </v-form>

    </v-container>
    <ErrorDialog @closed="showErrorDiag=false" :message="error" v-model="showErrorDiag"/>

</template>

<script setup>
import ErrorDialog from '@/components/ErrorDialog.vue';
import { useAuthStore } from '@/stores/auth';
import { paymentTypes } from '@/stores/backendEnums';
import { computed, ref } from 'vue';


const auth = useAuthStore()

const valid = ref(false)
const form = ref(null)
const user = ref(null)

const emit = defineEmits(['closed'])
const props = defineProps({
    modelView: Boolean,
    event: Object
})
const userAssist = computed(() => {
    return props.event.assists.filter( a => a.paid != true)
})
const error = ref('')
const showErrorDiag = ref(false)


const submitForm = async () => {
    try {
        const {valid: formValid} = await form.value.validate();
        if(!formValid) return 
        const request = {
            type: paymentTypes[7].value,
            eventId: props.event.id,
            price: props.event.price,
            userId: user.value
        }
        await auth.eventPayment(request)
        auth.fetchFallaAdminInfo()
        emit('closed')
    } catch(err) {
        error.value = err
        showErrorDiag.value = true
    }
}

function assistProps (item) {
    return {
        title: item.userName,
        value: item.userId
    }
}



</script>