<template>
    <v-dialog v-model="show" width="500">
        <v-card v-if="user"  class="bg-primary">
            <v-card-title class="text-h5 text-black bg-ternary">{{ user.name }} {{ user.surname }}</v-card-title>
            <v-card-text class="pa-4">{{ user.birthday }}</v-card-text>
            <v-switch 
                v-if="user.id!=auth.userInfo.id"
                v-model="adminAccess"
                class="text-black"
                label="Administrador"
                @click="editAdminAccess"
            ></v-switch>
            <v-divider></v-divider>

        <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn class="bg-secondary" variant="text" @click="show = false">
            Tanca
            </v-btn>
        </v-card-actions>
        </v-card>
        <v-dialog v-model="showErrorDiag" max-width="400">
            <v-card>
                <v-card-title class="text-h5 text-white bg-error">Error</v-card-title>
                    
                    <v-card-text class="pa-4">
                    {{ error }}
                    </v-card-text>
                    
                    <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="error" variant="text" @click="showErrorDiag=false">
                        Tanca
                    </v-btn>
                    </v-card-actions>
            </v-card>
        </v-dialog>
     </v-dialog>
</template>

<script setup>
import { useAuthStore } from '@/stores/auth';
import { computed, ref,reactive } from 'vue';

const props = defineProps({
    modelValue: Boolean,
    user: Object
})
const adminAccess = ref(props.user.adminAccess)
const error = ref('')
const auth = useAuthStore()
const showErrorDiag = ref(false)
const emit = defineEmits(['update:modelValue'])
const show = computed({
    get: () => props.modelValue,
    set: (value) => emit('update:modelValue', value)
})
const editAdminAccess = async () => {
    try {
        
        await auth.editAdminAccess(props.user.id, adminAccess)

    } catch(err) {
        error.value=err
        showErrorDiag.value = true
    }

}

</script>