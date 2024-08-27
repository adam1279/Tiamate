import '@assets/style.css';

import { createApp } from "vue";
import Print from './Print.vue';
import { createPinia } from 'pinia';
// const print = window.process?.argv?.includes("tiamate-print");
// const print = !!(new URLSearchParams(window.location.search)).get("print");
const pinia = createPinia();
const app = createApp(Print);
app.use(pinia);
app.mount("#app");