<script setup>
import { useAuthStore } from '@/stores/auth';
import { ref } from 'vue';

    const auth = useAuthStore()
    const uName = ref(auth.userInfo?.name || '')
    const uSurname = ref(auth.userInfo?.surname || '')
    const uBirthday = ref(auth.userInfo?.birthday || '')
    const uShowBday = ref(auth.userInfo?.showBday || '')
    const sendUpdateForm = () => {
        auth.updateUser(uName.value, uSurname.value, uBirthday.value, uShowBday.value)
    }
</script>

<template>
    <div name="CONTAINER" class="w-100 update-container">
        <form @submit.prevent="sendUpdateForm" class="w-100 update-form">
            <input
                v-model="uName",
                id="uName"
                placeholder="Nom de l'usuari"
                required="false"
                class="w-100"
            />
            <input
                v-model="uSurname"
                id="uSurname"
                placeholder="Cognoms de l'usuari"
                required="false"
                class="w-100"
            />
            <input
                v-model="uBirthday"
                id="uBirthday"
                required="false"
                type="date"
                class="w-100"
            />
            <button type="submit" class="update-button">Guarda canvis</button>
        </form>
    </div>
</template>

<style>
.update-container {
    background-color: slategray;
    flex-grow: 1;
    display: block;
    width: 100%;
    box-sizing: border-box;
    justify-content: left;
    align-items: left;
    min-height: 20%;
}
.update-form{
    max-width: max-content;
    padding: 10px;
    display: block;
    flex-direction: column;
    justify-content: center;
    align-content: center;
    gap: 15px;             
}
input{
    width: 100%;
    display: block;
    border-color: black;
    background-color: white;
    border-style: solid;
    border-radius: 10px;
    padding: 10px;
    max-width: 250px;
}
.update-button {
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
</style>