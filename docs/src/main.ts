import { createApp } from "vue";
import "./style.css";
import App from "./App.vue";
import { pinia, router, vuetify } from "./plugins";

createApp(App).use(pinia).use(vuetify).use(router).mount("#app");
