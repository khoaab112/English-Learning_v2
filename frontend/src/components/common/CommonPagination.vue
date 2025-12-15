<template>
  <div class="d-flex justify-content-between align-items-center w-100">
    <!-- Optional Info Text (can be hidden optionally via prop if needed) -->
    <div v-if="showInfo" class="small text-muted">
        Hiển thị {{ (currentPage - 1) * limit + 1 }}-{{ Math.min(currentPage * limit, total) }} trên {{ total }} bản ghi
    </div>
    <!-- Pagination Controls -->
    <nav v-if="totalPages > 1" :class="{ 'w-100 d-flex justify-content-end': !showInfo }">
        <ul class="pagination custom-pagination mb-0 gap-2">
            <li class="page-item" :class="{ disabled: currentPage === 1 }">
            <button class="page-link" @click="$emit('page-change', currentPage - 1)">
                <i class="fas fa-chevron-left"></i>
            </button>
            </li>
            
            <li v-for="page in visiblePages" :key="page" class="page-item" :class="{ active: currentPage === page }">
                <button class="page-link" @click="$emit('page-change', page)">{{ page }}</button>
            </li>

            <li class="page-item" :class="{ disabled: currentPage === totalPages }">
            <button class="page-link" @click="$emit('page-change', currentPage + 1)">
                <i class="fas fa-chevron-right"></i>
            </button>
            </li>
        </ul>
    </nav>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps({
  currentPage: { type: Number, required: true },
  totalPages: { type: Number, required: true },
  total: { type: Number, default: 0 },
  limit: { type: Number, default: 10 },
  showInfo: { type: Boolean, default: false } 
});

defineEmits(['page-change']);

const visiblePages = computed(() => {
    // Basic logic for now - show all up to a reasonable limit or simplified range
    // Ideally we duplicate the full logic if complex, but here loop is strictly 1..totalPages
    // UsersView uses "v-for="page in totalPages"" which implies it shows ALL pages.
    // We will do same for consistency.
    const pages = [];
    for (let i = 1; i <= props.totalPages; i++) {
        pages.push(i);
    }
    return pages; 
});
</script>

<style scoped>
/* Using Scoped CSS to ensure it works reusing the exact UsersView styles */
.custom-pagination .page-item .page-link {
  border-radius: 50%;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #dee2e6;
  color: #6c757d;
  background-color: transparent;
  margin: 0 2px;
  font-weight: 500;
  transition: all 0.2s ease;
}

.custom-pagination .page-item .page-link:hover {
  background-color: #e9ecef;
  color: #495057;
  border-color: #dee2e6;
}

.custom-pagination .page-item.active .page-link {
  background-color: #3b82f6; 
  border-color: #3b82f6;
  color: white;
  box-shadow: 0 2px 4px rgba(59, 130, 246, 0.3);
}

.custom-pagination .page-item.disabled .page-link {
  color: #adb5bd;
  background-color: transparent;
  border-color: #dee2e6;
  cursor: not-allowed;
}

.custom-pagination .page-link:focus {
  box-shadow: none;
}
</style>
