import { defineStore } from 'pinia';
import { ref } from 'vue';
import axios from 'axios';

export const useAuthStore = defineStore('auth', () => {
    const user = ref<any>(null);
    const token = ref<string | null>(localStorage.getItem('token'));

    const login = async (email: string, pass: string) => {
        try {
            // Assuming backend is at localhost:3000
            const response = await axios.post(`${import.meta.env.VITE_API_URL}/auth/login`, { email, password: pass });
            token.value = response.data.access_token;
            user.value = response.data.user;
            if (token.value) {
                localStorage.setItem('token', token.value);
            }
        } catch (error) {
            console.error(error);
            throw error;
        }
    };

    const logout = () => {
        token.value = null;
        user.value = null;
        localStorage.removeItem('token');
    };

    return { user, token, login, logout };
});
