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
import { useAuthStore } from './stores/auth'

// Axios Interceptor for Refresh Token
let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
    failedQueue.forEach(prom => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token);
        }
    });
    failedQueue = [];
};

axios.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // Prevent infinite loop
        if (error.response?.status === 401 && !originalRequest._retry && originalRequest.url !== '/auth/refresh' && originalRequest.url !== '/auth/login') {

            if (isRefreshing) {
                return new Promise(function (resolve, reject) {
                    failedQueue.push({ resolve, reject });
                }).then(token => {
                    originalRequest.headers['Authorization'] = 'Bearer ' + token;
                    return axios(originalRequest);
                }).catch(err => {
                    return Promise.reject(err);
                });
            }

            originalRequest._retry = true;
            isRefreshing = true;

            const authStore = useAuthStore();
            try {
                const newToken = await authStore.refresh();
                isRefreshing = false;
                processQueue(null, newToken);
                originalRequest.headers['Authorization'] = 'Bearer ' + newToken;
                return axios(originalRequest);
            } catch (err) {
                isRefreshing = false;
                processQueue(err, null);
                authStore.logout();
                router.push('/login');
                return Promise.reject(err);
            }
        }
        return Promise.reject(error);
    }
);

app.mount('#app')
