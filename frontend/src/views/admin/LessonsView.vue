<template>
  <div>
    <div class="d-flex justify-content-between align-items-center mb-4">
      <div>
        <h2 class="fw-bold text-dark">Quản Lý Bài Học</h2>
        <p class="text-muted">Tạo và quản lý các bài nghe chép chính tả.</p>
      </div>
      <button @click="openModal" class="btn btn-primary">
        <i class="fas fa-plus me-2"></i> Tạo Bài Học
      </button>
    </div>

    <div class="card border-0 shadow-sm">
      <div class="card-body p-0">
        <div class="table-responsive">
          <table class="table table-hover align-middle mb-0">
            <thead class="bg-light text-muted small text-uppercase">
              <tr>
                <th class="ps-4">ID</th>
                <th>Tiêu Đề</th>
                <th>Cấp Độ</th>
                <th>Thời Lượng</th>
                <th class="text-end pe-4">Thao Tác</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="lesson in lessons" :key="lesson.id">
                <td class="ps-4 text-muted">#{{ lesson.id }}</td>
                <td class="fw-bold text-primary">{{ lesson.title }}</td>
                <td>
                  <span class="badge rounded-pill" :class="{
                    'bg-success-subtle text-success': lesson.level === 'EASY',
                    'bg-info-subtle text-info': lesson.level === 'MEDIUM',
                    'bg-danger-subtle text-danger': lesson.level === 'HARD',
                  }">
                    {{ lesson.level }}
                  </span>
                </td>
                <td class="text-muted"><i class="far fa-clock me-1"></i> {{ lesson.duration }}s</td>
                <td class="text-end pe-4">
                  <button @click="deleteLesson(lesson.id)" class="btn btn-sm btn-outline-danger">
                    <i class="fas fa-trash-alt"></i>
                  </button>
                </td>
              </tr>
              <tr v-if="lessons.length === 0">
                <td colspan="5" class="text-center py-5 text-muted">
                  <i class="fas fa-file-audio fa-2x mb-3"></i>
                  <p>Chưa có bài học nào được tạo</p>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Bootstrap Modal -->
    <div class="modal fade" id="createLessonModal" tabindex="-1" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content border-0 shadow">
          <div class="modal-header border-bottom-0 pb-0">
            <h5 class="modal-title fw-bold">Tạo Bài Học Mới</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Đóng"></button>
          </div>
          <div class="modal-body">
            <!-- Mode Selection -->
            <div v-if="creationMode === 'SELECT'" class="row g-3 py-4">
              <div class="col-6">
                <div @click="creationMode = 'MANUAL'" class="card h-100 border-primary-hover shadow-sm cursor-pointer text-center p-4">
                   <div class="mb-3 text-primary"><i class="fas fa-edit fa-3x"></i></div>
                   <h6 class="fw-bold">Tạo Thủ Công</h6>
                   <p class="small text-muted mb-0">Nhập tiêu đề, audio và nội dung bài học từ đầu.</p>
                </div>
              </div>
              <div class="col-6">
                <div @click="creationMode = 'TEMPLATE'" class="card h-100 border-success-hover shadow-sm cursor-pointer text-center p-4">
                   <div class="mb-3 text-success"><i class="fas fa-magic fa-3x"></i></div>
                   <h6 class="fw-bold">Tạo Từ Template</h6>
                   <p class="small text-muted mb-0">Dùng mẫu có sẵn AI tạo để tiết kiệm thời gian.</p>
                </div>
              </div>
            </div>

            <!-- Manual Form -->
            <div v-if="creationMode === 'MANUAL'">
                <div class="d-flex align-items-center mb-3">
                    <button @click="creationMode = 'SELECT'" class="btn btn-sm btn-light me-2 rounded-circle"><i class="fas fa-arrow-left"></i></button>
                    <h6 class="fw-bold m-0 text-primary">Tạo Thủ Công</h6>
                </div>
                <form @submit.prevent="createLesson">
                  <div class="mb-3">
                    <label class="form-label text-muted small fw-bold">Tiêu Đề Bài Học</label>
                    <input v-model="newLesson.title" class="form-control" placeholder="VD: Hội thoại tại công viên" required />
                  </div>
                  
                  <div class="mb-3">
                    <label class="form-label text-muted small fw-bold">URL Âm Thanh (Audio)</label>
                    <div class="input-group">
                      <span class="input-group-text bg-light"><i class="fas fa-link"></i></span>
                      <input v-model="newLesson.audioUrl" class="form-control" placeholder="https://..." required />
                    </div>
                  </div>

                  <div class="row g-3 mb-3">
                    <div class="col-6">
                      <label class="form-label text-muted small fw-bold">Cấp Độ</label>
                      <select v-model="newLesson.level" class="form-select">
                        <option value="EASY">Dễ</option>
                        <option value="MEDIUM">Trung Bình</option>
                        <option value="HARD">Khó</option>
                      </select>
                    </div>
                    <div class="col-6">
                      <label class="form-label text-muted small fw-bold">Thời Lượng (giây)</label>
                      <input type="number" v-model="newLesson.duration" class="form-control" />
                    </div>
                  </div>

                  <div class="mb-4">
                    <label class="form-label text-muted small fw-bold">Nội Dung Gốc (Transcript)</label>
                    <textarea v-model="newLesson.transcript" class="form-control" rows="4" required></textarea>
                  </div>

                  <div class="d-flex justify-content-end gap-2">
                    <button type="button" class="btn btn-light text-muted" data-bs-dismiss="modal">Hủy</button>
                    <button type="submit" class="btn btn-primary px-4">Tạo Bài Học</button>
                  </div>
                </form>
            </div>

            <!-- Template Placeholder (UI Only) -->
            <div v-if="creationMode === 'TEMPLATE'">
                <div class="d-flex align-items-center mb-3">
                    <button @click="creationMode = 'SELECT'" class="btn btn-sm btn-light me-2 rounded-circle"><i class="fas fa-arrow-left"></i></button>
                    <h6 class="fw-bold m-0 text-success">Chọn Template Mẫu</h6>
                </div>
                <div class="alert alert-info border-0 rounded-3">
                    <i class="fas fa-hammer me-2"></i> Tính năng đang phát triển.
                </div>
                 <!-- Mock Templates -->
                 <div class="list-group">
                     <button class="list-group-item list-group-item-action d-flex justify-content-between align-items-center" disabled>
                         <div>
                             <div class="fw-bold">Daily Conversation</div>
                             <small class="text-muted">Hội thoại hàng ngày (300 từ)</small>
                         </div>
                         <span class="badge bg-secondary">Coming Soon</span>
                     </button>
                     <button class="list-group-item list-group-item-action d-flex justify-content-between align-items-center" disabled>
                         <div>
                             <div class="fw-bold">News Report</div>
                             <small class="text-muted">Bản tin thời sự (500 từ)</small>
                         </div>
                         <span class="badge bg-secondary">Coming Soon</span>
                     </button>
                 </div>
            </div>
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
import { Modal } from 'bootstrap';

const lessons = ref<any[]>([]);
const newLesson = ref({
    title: '',
    audioUrl: '',
    transcript: '',
    level: 'EASY',
    duration: 60
});
const authStore = useAuthStore();
const creationMode = ref<'SELECT' | 'MANUAL' | 'TEMPLATE'>('SELECT');
let modalInstance: Modal | null = null;

const fetchLessons = async () => {
  try {
    const response = await axios.get(`${import.meta.env.VITE_API_URL}/lessons`, {
         headers: { Authorization: `Bearer ${authStore.token}` }
    });
    lessons.value = response.data;
  } catch (error) {
    console.error('Error fetching lessons:', error);
  }
};

const openModal = () => {
  creationMode.value = 'SELECT'; // Reset mode
  const modalEl = document.getElementById('createLessonModal');
  if (modalEl) {
    modalInstance = new Modal(modalEl);
    modalInstance.show();
  }
};

const createLesson = async () => {
  try {
    await axios.post(`${import.meta.env.VITE_API_URL}/lessons`, newLesson.value, {
         headers: { Authorization: `Bearer ${authStore.token}` }
    });
    // Close modal
    const modalEl = document.getElementById('createLessonModal');
    if (modalEl) {
        const modal = Modal.getInstance(modalEl);
        modal?.hide();
    }
    
    newLesson.value = { title: '', audioUrl: '', transcript: '', level: 'EASY', duration: 60 };
    fetchLessons();
  } catch (error) {
    console.error('Error creating lesson:', error);
  }
}

const deleteLesson = async (id: number) => {
  if (!confirm('Bạn có chắc chắn muốn xóa bài học này?')) return;
  try {
    await axios.delete(`${import.meta.env.VITE_API_URL}/lessons/${id}`, {
         headers: { Authorization: `Bearer ${authStore.token}` }
    });
    fetchLessons();
  } catch (error) {
    console.error('Lỗi khi xóa bài học:', error);
  }
};

onMounted(fetchLessons);
</script>

<style scoped>
.cursor-pointer {
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
}
.cursor-pointer:hover {
    transform: translateY(-5px);
    box-shadow: 0 .5rem 1rem rgba(0,0,0,.15)!important;
}
.cursor-pointer:active {
    transform: translateY(-2px);
    box-shadow: 0 .25rem .5rem rgba(0,0,0,.1)!important;
}

.border-primary-hover:hover {
  border-color: #0d6efd !important;
  background-color: rgba(13, 110, 253, 0.05);
}
.border-success-hover:hover {
  border-color: #198754 !important;
  background-color: rgba(25, 135, 84, 0.05);
}
</style>
