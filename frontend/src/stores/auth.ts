import { defineStore } from 'pinia';
import { ref } from 'vue';
import axios from 'axios';

export const useAuthStore = defineStore('auth', () => {
    const REFRESH_KEY = import.meta.env.VITE_REFRESH_TOKEN_KEY || 'refreshToken';

    const user = ref<any>(JSON.parse(localStorage.getItem('user') || 'null'));
    const token = ref<string | null>(localStorage.getItem('token'));
    const refreshToken = ref<string | null>(localStorage.getItem(REFRESH_KEY));

    const login = async (email: string, pass: string) => {
        try {
            const response = await axios.post(`${import.meta.env.VITE_API_URL}/auth/login`, { email, password: pass });
            token.value = response.data.access_token;
            refreshToken.value = response.data.refresh_token;
            user.value = response.data.user;

            if (token.value) localStorage.setItem('token', token.value);
            // Only store Refresh Token
            if (refreshToken.value) localStorage.setItem(REFRESH_KEY, refreshToken.value);
            if (user.value) localStorage.setItem('user', JSON.stringify(user.value));

        } catch (error) {
            console.error(error);
            throw error;
        }
    };

    const logout = async () => {
        try {
            if (token.value) {
                await axios.post(`${import.meta.env.VITE_API_URL}/auth/logout`, {}, {
                    headers: { Authorization: `Bearer ${token.value}` }
                });
            }
        } catch (e) {
            // Ignore error
        }
        token.value = null;
        refreshToken.value = null;
        user.value = null;
        localStorage.removeItem('token');
        localStorage.removeItem(REFRESH_KEY);
        localStorage.removeItem('user');
    };

    const refresh = async () => {
        try {
            if (!refreshToken.value) throw new Error('No refresh token');
            const response = await axios.post(`${import.meta.env.VITE_API_URL}/auth/refresh`, {
                refreshToken: refreshToken.value
            });
            token.value = response.data.access_token;
            refreshToken.value = response.data.refresh_token;

            localStorage.setItem(REFRESH_KEY, refreshToken.value!);
            return token.value;
        } catch (error) {
            logout();
            throw error;
        }
    };

    return { user, token, refreshToken, login, logout, refresh };


});
