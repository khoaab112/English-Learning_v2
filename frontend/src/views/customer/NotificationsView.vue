<template>
  <div>
    <h2 class="fw-bold mb-4">Thông Báo Của Tôi</h2>
    
    <div v-if="notifications.length === 0" class="text-center py-5 text-muted bg-white rounded shadow-sm">
       <i class="far fa-bell-slash fa-3x mb-3"></i>
       <p>Bạn không có thông báo nào mới.</p>
    </div>

    <div v-else class="list-group shadow-sm">
      <div 
        v-for="notif in notifications" 
        :key="notif.id" 
        class="list-group-item list-group-item-action p-4 border-0 mb-1 rounded"
        :class="{ 'bg-white': notif.isRead, 'bg-body-secondary fw-bold': !notif.isRead }"
      >
        <div class="d-flex w-100 justify-content-between mb-1">
          <h5 class="mb-1 text-primary">{{ notif.title }}</h5>
          <small class="text-muted">{{ new Date(notif.createdAt).toLocaleDateString() }}</small>
        </div>
        <p class="mb-2">{{ notif.message }}</p>
        <div class="d-flex justify-content-end">
           <button v-if="!notif.isRead" @click="markRead(notif.id)" class="btn btn-sm btn-outline-primary rounded-pill">
             <i class="fas fa-check me-1"></i> Đánh dấu đã đọc
           </button>
           <span v-else class="text-success small"><i class="fas fa-check-double"></i> Đã xem</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { useAuthStore } from '../../stores/auth';

const notifications = ref<any[]>([]);
const authStore = useAuthStore();

const fetchNotifications = async () => {
  try {
    const response = await axios.get(`${import.meta.env.VITE_API_URL}/notifications/my`, {
      headers: { Authorization: `Bearer ${authStore.token}` }
    });
    notifications.value = response.data;
  } catch (error) {
    console.error('Lỗi tải thông báo:', error);
  }
};

const markRead = async (id: number) => {
  try {
    await axios.patch(`${import.meta.env.VITE_API_URL}/notifications/${id}/read`, {}, {
      headers: { Authorization: `Bearer ${authStore.token}` }
    });
    // Update local state
    const target = notifications.value.find(n => n.id === id);
    if (target) target.isRead = true;
  } catch (error) {
    console.error('Lỗi cập nhật:', error);
  }
};

onMounted(fetchNotifications);
</script>
