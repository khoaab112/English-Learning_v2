import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useConfirmStore = defineStore('confirm', () => {
    const isVisible = ref(false);
    const title = ref('');
    const message = ref('');
    const confirmText = ref('Xác nhận');
    const cancelText = ref('Hủy');
    const type = ref<'primary' | 'danger' | 'warning'>('primary');

    let resolvePromise: ((value: boolean) => void) | null = null;

    const show = (opts: {
        title: string;
        message: string;
        confirmText?: string;
        cancelText?: string;
        type?: 'primary' | 'danger' | 'warning'
    }) => {
        title.value = opts.title;
        message.value = opts.message;
        confirmText.value = opts.confirmText || 'Đồng ý';
        cancelText.value = opts.cancelText || 'Hủy';
        type.value = opts.type || 'primary';
        isVisible.value = true;

        return new Promise<boolean>((resolve) => {
            resolvePromise = resolve;
        });
    };

    const confirm = () => {
        isVisible.value = false;
        if (resolvePromise) resolvePromise(true);
    };

    const cancel = () => {
        isVisible.value = false;
        if (resolvePromise) resolvePromise(false);
    };

    return {
        isVisible,
        title,
        message,
        confirmText,
        cancelText,
        type,
        show,
        confirm,
        cancel
    };
});
