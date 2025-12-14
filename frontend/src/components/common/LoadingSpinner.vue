<template>
  <div v-if="loading" class="loading-overlay d-flex justify-content-center align-items-center">
    <div class="spinner-border text-primary" role="status" style="width: 3rem; height: 3rem;">
      <span class="visually-hidden">Loading...</span>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  loading: boolean
}>();
</script>

<style scoped>
.loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(255, 255, 255, 0.7);
  z-index: 100;
  backdrop-filter: blur(2px);
  border-radius: inherit;
}
</style>
