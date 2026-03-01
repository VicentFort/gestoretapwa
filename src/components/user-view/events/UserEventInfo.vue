<script setup>
import { useAuthStore } from '@/stores/auth';
import UserEventDialog from './UserEventDialog.vue';
import { ref } from 'vue';


const auth = useAuthStore()
const isDialogOpen = ref(false);
const selectedEvent = ref(null);

const showEvent = (event) => {
  selectedEvent.value = event;
  isDialogOpen.value = true;
};
</script>

<template>
    <div class="event-list-container">
        <br style="background-color: slategray">
            <v-list class="event-list">
                <v-list-item class="event-item"
                    v-for="event in auth.userInfo.events" 
                    :key="event.id"
                    :title="event.title"
                    @click="showEvent(event)"
                >
            </v-list-item>
            </v-list>
            <v-dialog v-model="isDialogOpen" width="auto">
                <UserEventDialog v-model="isDialogOpen" :event="selectedEvent"/>
            </v-dialog>
    </div>

</template>

<style scoped>
.event-item{
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
.event-list{

    display: block;
    background-color: white;
    flex-direction: row;
    justify-items: center;  
    align-content: center;
    width: 100%; 
}
.event-list-container{
    background-color: slategray;

}
</style>