import { createApp } from "vue";
import App from "./App.vue";
import "./registerServiceWorker";
import router from "./router";
import { createPinia } from "pinia";
import "./registerServiceWorker";
import "./style/main.css"
import vuetify from "./plugins/vuetify";
createApp(App).use(router).use(vuetify).use(createPinia()).mount("#app");
