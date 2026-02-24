import { defineStore } from "pinia";
import api from "@/stores/api"

export const useEventStore = defineStore("event", {
    state: () => ({
        fallaEvents: JSON.parse(sessionStorage.getItem("fallaEvents") || null),
        userEvents: JSON.parse(sessionStorage.getItem("userEvents") || null)
    }),
    actions: {
        async fetchFallaEvents() {
            try {
                const response = await api.get('/falla/events')
                if(response.data.sucess!= null && !response.data?.success) throw response.data.message
                this.fallaEvents = response.data
                sessionStorage.setItem("fallaEvents", JSON.stringify(this.fallaEvents))
            } catch(error) {
                console.error(error)
            }
        },
        async fecthUserEvents() {
            try {
                const response = await api.get("/user/events")
                if(response.data.sucess!= null && !response.data?.success) throw response.data.message
                this.userEvents = response.data;
                sessionStorage.setItem("userEvents", JSON.stringify(this.userEvents))
            } catch(error) {
                console.error(error)
            }
        }
    }
})