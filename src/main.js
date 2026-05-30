import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import { createPinia } from "pinia";
import "vuetify/styles"; 
import "./style/main.css";
import vuetify from "./plugins/vuetify";


import "./registerServiceWorker";

createApp(App).use(vuetify).use(createPinia()).use(router).mount("#app");
