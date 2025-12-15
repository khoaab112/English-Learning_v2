<template>
  <div>
    <div class="mb-4">
      <h2 class="fw-bold text-dark">Gửi Thông Báo</h2>
      <p class="text-muted">Gửi tin nhắn hoặc thông báo đến người dùng.</p>
    </div>

    <div class="row">
      <!-- Send Form -->
      <div class="col-md-5 mb-4">
        <div class="card border-0 shadow-sm">
          <div class="card-body">
            <h5 class="card-title fw-bold mb-3">Soạn Tin Mới</h5>
            <form @submit.prevent="sendNotification">
              <div class="mb-3">
                <label class="form-label text-muted small fw-bold">Tiêu Đề</label>
                <input v-model="form.title" class="form-control" required placeholder="Nhập tiêu đề..." />
              </div>

              <div class="mb-3">
                <label class="form-label text-muted small fw-bold">Loại Thông Báo</label>
                <select v-model="form.type" class="form-select">
                  <option value="GLOBAL">Toàn Bộ Người Dùng (Global)</option>
                  <option value="INDIVIDUAL">Cá Nhân (1-1)</option>
                </select>
              </div>

              <div v-if="form.type === 'INDIVIDUAL'" class="mb-3">
                <label class="form-label text-muted small fw-bold">Người Nhận (ID)</label>
                <input type="number" v-model="form.receiverId" class="form-control" placeholder="Nhập ID người dùng..." />
                <div class="form-text">Bạn có thể tìm ID trong trang Quản lý người dùng.</div>
              </div>

              <div class="mb-3">
                <label class="form-label text-muted small fw-bold">Nội Dung</label>
                <textarea v-model="form.message" class="form-control" rows="4" required placeholder="Nhập nội dung tin nhắn..."></textarea>
              </div>

              <button type="submit" class="btn btn-primary w-100" :disabled="loading">
                <i class="fas fa-paper-plane me-2"></i> {{ loading ? 'Đang gửi...' : 'Gửi Thông Báo' }}
              </button>
            </form>
          </div>
        </div>
      </div>

      <!-- Recent Notifications List (Mock or Real if implemented) -->
      <div class="col-md-7">
        <div class="card border-0 shadow-sm">
           <div class="card-body">
              <h5 class="card-title fw-bold mb-3">Lịch Sử Thông Báo (Của Tôi)</h5>
              <!-- For now just showing sent is complex without a Sent entity tracking, 
                   so we might just list notifications the admin receives or a placeholder. 
                   Ideally, we'd query 'notifications sent by me', but let's stick to MVP.
              -->
              <div class="alert alert-info border-0 d-flex align-items-center">
                <i class="fas fa-info-circle me-3 fa-2x"></i>
                <div>
                   Hiện tại hệ thống chỉ hỗ trợ xem thông báo người dùng đã nhận. 
                   Tính năng "Hộp thư đã gửi" sẽ được cập nhật sau.
                </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import axios from 'axios';
import { useAuthStore } from '../../stores/auth';

const authStore = useAuthStore();
const loading = ref(false);
const form = ref({
  title: '',
  message: '',
  type: 'GLOBAL',
  receiverId: null as number | null
});

const sendNotification = async () => {
  loading.value = true;
  try {
    await axios.post(`${import.meta.env.VITE_API_URL}/notifications`, form.value, {
      headers: { Authorization: `Bearer ${authStore.token}` }
    });
    alert('Đã gửi thông báo thành công!');
    form.value = { title: '', message: '', type: 'GLOBAL', receiverId: null };
  } catch (error) {
    console.error('Lỗi khi gửi:', error);
    alert('Gửi thất bại. Vui lòng kiểm tra lại.');
  } finally {
    loading.value = false;
  }
};
</script>
