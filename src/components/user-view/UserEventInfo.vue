<script setup>
import { useAuthStore } from '@/stores/auth';
import { useEventStore } from '@/stores/event';


const auth = useAuthStore()
const eventStore = useEventStore()
if(eventStore.userEvents == null) {
    eventStore.fecthUserEvents()
}
</script>

<template>
    <div class="event-list-container">
        <h2>Llistat d'events</h2>
            <v-list class="event-list">
                <v-list-item class="event-item"
                    v-for="event in eventStore.userEvents" 
                    :key="event.id"
                    :title="event.title"
                >
            </v-list-item>
            </v-list>
    </div>

</template>

<style>
.event-item{
   width: 100%;
    display: block;
    border-color: black;
    background-color: white;
    border-style: solid;
    border-width: 2px;
    border-radius: 10px;
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