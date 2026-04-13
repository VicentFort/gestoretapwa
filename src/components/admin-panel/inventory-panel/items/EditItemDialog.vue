<template>
    <v-container>
        <v-form @submit.prevent="submitForm" ref="form" v-model="valid">
            <v-card class="bg-primary">
                <v-card-title class="text-primary font-weight-bold bg-ternary">
                    Editant el item: {{ item.name }}
                </v-card-title>
                <v-col>
                    <v-row rows="12" md="6">
                        <v-text-field
                            label="Nom"
                            v-model="localItem.name"
                            type="text"
                            required
                        ></v-text-field>
                    </v-row>
                    <v-row rows="12" md="6">
                        <v-text-field 
                            label="Descripció"
                            v-model="localItem.description"
                            type="text"
                            required
                        ></v-text-field>
                    </v-row>
                    <v-row rows="12" md="6">
                        <v-select
                            :items="categories"
                            v-model="localItem.category"
                            label="Categoria"
                        ></v-select>
                    </v-row>
                </v-col>
                <v-card-actions>
                    <v-btn class="align-left bg-ternary" icon="mdi-cancel" @click="emit('closed')"></v-btn>
                    <v-btn class="bg-ternary" type="submit" icon="mdi-plus"></v-btn>
                </v-card-actions>
            </v-card>
        </v-form>
    </v-container>
</template>

<script setup>
import { useAuthStore } from '@/stores/auth';
import { ref, watch } from 'vue';

const auth = useAuthStore()

const categories = auth.itemCategories

const valid = ref(false)
const form = ref(null)

const props = defineProps({
    modelView: Boolean,
    item: Object
})

const localItem = ref({...props.item})

watch(() => props.item, (newVal)=> {
    localItem.value = {...newVal}
}, {deep:true})

const emit = defineEmits(['closed'])

const submitForm = async () => {
    try {
        const {valid: formValid} = await form.value.validate()
        if(!formValid) return;

        const updatedItem = {
            itemId: props.item.id,
            name: localItem.value.name,
            description: localItem.value.description,
            itemCategory: localItem.value.category
        }
        await auth.updateInventoryItem(updatedItem)
        emit('closed')

    } catch (err) {
        console.error(err)
    }
}


</script>