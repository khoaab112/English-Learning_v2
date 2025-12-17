import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'
import './style.css'

const app = createApp(App)

const pinia = createPinia()
app.use(pinia)
app.use(router)

import axios from 'axios'
// Axios default base URL if needed, but we use api service now.
// axios.defaults.baseURL = import.meta.env.VITE_API_URL;

app.mount('#app')
