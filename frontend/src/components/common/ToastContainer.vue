<template>
  <div class="toast-container position-fixed top-0 end-0 p-3" style="z-index: 9999">
    <ToastItem 
      v-for="toast in toastStore.toasts" 
      :key="toast.id" 
      :toast="toast" 
      @close="toastStore.remove(toast.id)"
    />
  </div>
</template>

<script setup lang="ts">
import { useToastStore } from '../../stores/toast';
import ToastItem from './ToastItem.vue';

const toastStore = useToastStore();
</script>

<style scoped>
.toast-container {
    pointer-events: none;
}
.toast-container > * {
    pointer-events: auto;
}
</style>
