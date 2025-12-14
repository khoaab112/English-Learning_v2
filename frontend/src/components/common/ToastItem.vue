<template>
  <div 
    class="toast-item shadow-sm d-flex align-items-center mb-2 p-3 rounded"
    :class="typeClass"
    role="alert"
    aria-live="assertive"
    aria-atomic="true"
  >
    <div class="me-auto d-flex align-items-center">
        <i :class="iconClass" class="me-2 fa-lg"></i>
        <span>{{ toast.message }}</span>
    </div>
    <button 
      type="button" 
      class="btn-close ms-2 small" 
      :class="{'btn-close-white': isDark}"
      aria-label="Close" 
      @click="$emit('close')"
    ></button>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { Toast } from '../../stores/toast';

const props = defineProps<{
  toast: Toast
}>();

const typeClass = computed(() => {
  switch (props.toast.type) {
    case 'success': return 'bg-success text-white';
    case 'error': return 'bg-danger text-white';
    case 'warning': return 'bg-warning text-dark';
    case 'info': default: return 'bg-info text-white';
  }
});

const iconClass = computed(() => {
    switch (props.toast.type) {
    case 'success': return 'fas fa-check-circle';
    case 'error': return 'fas fa-exclamation-circle';
    case 'warning': return 'fas fa-exclamation-triangle';
    case 'info': default: return 'fas fa-info-circle';
  }
});

const isDark = computed(() => props.toast.type !== 'warning');
</script>

<style scoped>
.toast-item {
  min-width: 300px;
  max-width: 400px;
  animation: slideIn 0.3s ease forwards;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateX(100%);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}
</style>
