<template>
  <router-view />
  <ToastContainer />
</template>

<script setup lang="ts">
import ToastContainer from './components/common/ToastContainer.vue';
</script>

<style>
/* Global styles can go here */
body {
  font-family: 'Inter', sans-serif;
  margin: 0;
  padding: 0;
}
</style>
