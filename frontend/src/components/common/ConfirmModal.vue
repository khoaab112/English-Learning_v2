<script setup lang="ts">
import { useConfirmStore } from '../../stores/confirm';
import { storeToRefs } from 'pinia';

const confirmStore = useConfirmStore();
const { isVisible, title, message, confirmText, cancelText, type } = storeToRefs(confirmStore);

const getBtnClass = () => {
    switch (type.value) {
        case 'danger': return 'btn-danger';
        case 'warning': return 'btn-warning';
        default: return 'btn-primary';
    }
};

const handleBackdropClick = (e: MouseEvent) => {
    if (e.target === e.currentTarget) {
        confirmStore.cancel();
    }
};
</script>

<template>
    <div v-if="isVisible" class="modal fade show d-block" tabindex="-1" style="background-color: rgba(0,0,0,0.5); z-index: 10000;" @click="handleBackdropClick">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content shadow-lg border-0">
                <div class="modal-header border-bottom-0">
                    <h5 class="modal-title fw-bold" :class="{'text-danger': type === 'danger', 'text-warning': type === 'warning'}">
                        {{ title }}
                    </h5>
                    <button type="button" class="btn-close" @click="confirmStore.cancel()"></button>
                </div>
                <div class="modal-body py-4 fs-5 text-center">
                    {{ message }}
                </div>
                <div class="modal-footer border-top-0 justify-content-center pb-4">
                    <button type="button" class="btn btn-light px-4 me-2" @click="confirmStore.cancel()">
                        {{ cancelText }}
                    </button>
                    <button type="button" class="btn px-4" :class="getBtnClass()" @click="confirmStore.confirm()">
                        {{ confirmText }}
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.modal.show {
    animation: fadeIn 0.2s ease-out;
}
@keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
}
</style>
