<template>
  <div>
    <h2 class="fw-bold mb-4">Danh Sách Bài Học</h2>

    <div v-if="loading" class="text-center py-5">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>

    <div v-else-if="lessons.length === 0" class="text-center py-5 text-muted bg-white rounded shadow-sm">
      <i class="fas fa-book-open fa-3x mb-3"></i>
      <p>Chưa có bài học nào.</p>
    </div>

    <div v-else class="row g-4">
      <div v-for="lesson in lessons" :key="lesson.id" class="col-md-6 col-lg-4">
        <div class="card h-100 border-0 shadow-sm hover-shadow transition-all">
          <div class="card-body">
            <h5 class="card-title fw-bold text-primary mb-3">{{ lesson.title }}</h5>
            <div class="d-flex justify-content-between mb-2">
              <span class="badge bg-info-subtle text-info-emphasis rounded-pill">
                 {{ lesson.difficultyLevel }}
              </span>
              <small class="text-muted"><i class="far fa-clock me-1"></i> {{ lesson.duration }}s</small>
            </div>
            <p class="card-text text-muted small user-select-none">
              <!-- Basic description or truncated content if we had one. 
                   For now just a placeholder or icon. -->
               Luyện nghe và chép chính tả với bài học này.
            </p>
          </div>
          <div class="card-footer bg-white border-top-0 pb-3 pt-0">
            <router-link :to="`/lessons/${lesson.id}`" class="btn btn-outline-primary w-100 rounded-pill">
              <i class="fas fa-play me-2"></i> Bắt đầu học
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { useAuthStore } from '../../stores/auth';

const lessons = ref<any[]>([]);
const loading = ref(true);
const authStore = useAuthStore();

const fetchLessons = async () => {
  try {
    const response = await axios.get('http://localhost:3000/lessons', {
      headers: { Authorization: `Bearer ${authStore.token}` }
    });
    lessons.value = response.data;
  } catch (error) {
    console.error('Lỗi tải bài học:', error);
  } finally {
    loading.value = false;
  }
};

onMounted(fetchLessons);
</script>

<style scoped>
.hover-shadow:hover {
  transform: translateY(-5px);
  box-shadow: 0 .5rem 1rem rgba(0,0,0,.15)!important;
}
.transition-all {
  transition: all 0.3s ease;
}
</style>
