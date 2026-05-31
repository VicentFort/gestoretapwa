import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import { createPinia } from "pinia";
import "vuetify/styles"; 

import vuetify from "./plugins/vuetify";
import "@/style/main.css"

import "./registerServiceWorker";

const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)

const app = createApp(App).use(vuetify).use(pinia).use(router);
app.mount("#app");
