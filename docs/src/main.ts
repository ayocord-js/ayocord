import { createApp } from "vue";
import { pinia, vuetify } from "./plugins";
import router from "./plugins/router";
import App from "./App.vue";
//@ts-ignore
import "@fontsource/m-plus-rounded-1c/700.css";

createApp(App).use(vuetify).use(pinia).use(router).mount("#app");
