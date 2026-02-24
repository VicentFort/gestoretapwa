<script setup>
import { useAuthStore } from '@/stores/auth';
import { useEventStore } from '@/stores/event';


const auth = useAuthStore()
const eventStore = useEventStore()
eventStore.fecthUserEvents()
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
    background-color: white;
    align-self: center;
    display:block;
    align-content: center;
    justify-content: center;
    margin-top:2%;
    gap:15px;

    border-color: black;
    border-style: solid;
    border-width: 10%;
}
.event-list{

    background-color: slategray;
    align-content: center;
    justify-content: center;
}
.event-list-container{
    background-color: slategray;

    border-color: black;
    border-width: 10px;
    border-style: solid;
}
</style>