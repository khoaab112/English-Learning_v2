<template>
  <div class="search-container shadow-sm d-flex align-items-center bg-white px-2" style="border-radius: 4px;">
    <input 
      :value="modelValue" 
      @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
      @keyup.enter="$emit('search')"
      type="text" 
      class="form-control border-0 shadow-none bg-transparent ps-2" 
      :placeholder="placeholder"
    />
    <button @click="$emit('search')" class="btn btn-dark rounded-circle btn-sm d-flex align-items-center justify-content-center" style="width: 40px; height: 40px;">
       <i class="fas fa-search text-white" style="font-size: 16px;"></i>
    </button>
  </div>
</template>

<script setup lang="ts">
defineProps({
  modelValue: {
    type: String,
    default: ''
  },
  placeholder: {
    type: String,
    default: 'Tìm kiếm...'
  }
});
defineEmits(['update:modelValue', 'search']);
</script>

<style scoped>
/* Ensure styles are self-contained if not global */
.search-container {
    /* Height matches standard button height usually around 46px or 40px */
    height: 48px; 
    border-radius: 8px; /* Slightly rounded */
    border: 1px solid #dee2e6; /* Optional border */
}
.form-control:focus {
    box-shadow: none;
}
</style>
