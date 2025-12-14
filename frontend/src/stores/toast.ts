import { defineStore } from 'pinia';
import { ref } from 'vue';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface Toast {
    id: number;
    message: string;
    type: ToastType;
    duration?: number;
}

export const useToastStore = defineStore('toast', () => {
    const toasts = ref<Toast[]>([]);
    let counter = 0;

    const add = (message: string, type: ToastType = 'info', duration: number = 3000) => {
        const id = counter++;
        toasts.value.push({ id, message, type, duration });

        if (duration > 0) {
            setTimeout(() => {
                remove(id);
            }, duration);
        }
    };

    const remove = (id: number) => {
        const index = toasts.value.findIndex((t) => t.id === id);
        if (index !== -1) {
            toasts.value.splice(index, 1);
        }
    };

    const success = (message: string, duration?: number) => add(message, 'success', duration);
    const error = (message: string, duration?: number) => add(message, 'error', duration);
    const info = (message: string, duration?: number) => add(message, 'info', duration);
    const warning = (message: string, duration?: number) => add(message, 'warning', duration);

    return { toasts, add, remove, success, error, info, warning };
});
