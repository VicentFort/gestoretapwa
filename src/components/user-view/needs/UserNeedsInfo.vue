<script setup>
import { useAuthStore } from '@/stores/auth';
import AddNeedDialog from '@/components/user-view/needs/AddNeedDialog.vue';
import { ref } from 'vue';
import DeleteNeedDialog from './DeleteNeedDialog.vue';

const auth = useAuthStore()
const isDialogOpen = ref(false)
const isDeleteOpen = ref(false)
const selectedNeed = ref(null)
const openDialog = () => {
    isDialogOpen.value = true
}
const deleteNeed = (need) => {
    isDeleteOpen.value = true
    selectedNeed.value = need
}
</script>

<template>
    <p v-if="auth.userInfo?.foodNeeds">
        <div class="food-container">
           <h3 class="food-title">Les meues preferències alimentàries: </h3>
           <v-list >
                <v-list-item
                    v-for="need in auth.userInfo?.foodNeeds" 
                    :key="need.foodNeedId"
                    :title="need.description"
                    class="food-item"
                    @click="deleteNeed(need)"
                >
            </v-list-item>
            </v-list>
            <div style="background-color: white;">
                <button @click=openDialog class="add-food">Afegir necessitat</button>
            </div>
            <v-dialog v-model="isDialogOpen">
                <AddNeedDialog v-model="isDialogOpen" ></AddNeedDialog>
            </v-dialog>
            <v-dialog v-model="isDeleteOpen">
                 <DeleteNeedDialog v-model="isDeleteOpen" :need="selectedNeed"></DeleteNeedDialog>
            </v-dialog>
        </div>
    </p>
</template>

<style scoped>
.add-food{
    margin: auto;
    display: flex;
    padding: 1rem;
    border-radius: 8px;
    background-color: white;
    border-color: black;
    border-width: 10%;
    border-style: solid;
    color: black;
}
.food-title{
    color:black;
    font-size:bold;
}
.food-item{
    width: 100%;
    display: block;
    border-color: black;
    background-color: white;
    border-style: solid;
    border-width: 2px;
    border-radius: 10px;
    justify-self: center;
    padding: 10px;
    max-width: 250px;
    margin: 1px;
}
.food-list{
    display: block;
    background-color: white;
    flex-direction: row;
    justify-items: center;  
    align-content: center;
    width: 100%; 
}
.food-container{
    
    background-color: slategray;

}
</style>