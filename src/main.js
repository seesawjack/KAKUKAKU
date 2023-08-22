import { createApp } from 'vue'
import { createPinia } from 'pinia'
import router from './router'
import './style.css'
import App from './App.vue'
import VueGtag from "vue-gtag";

const pinia = createPinia();
const app = createApp(App);

app.use(pinia);
app.use(router);
app.use(VueGtag, {
    config: { id: import.meta.env.VITE_GA4_ID }
},router)


app.mount('#app');