<template>
  <div class="d-flex min-vh-100">
    <!-- Sidebar -->
    <aside class="bg-white border-end shadow-sm d-flex flex-column" style="width: 280px; position: fixed; top: 0; bottom: 0; z-index: 1000;">
      <div class="p-4 border-bottom">
        <div class="d-flex align-items-center gap-2">
          <div class="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center" style="width: 35px; height: 35px;">
            <i class="fas fa-graduation-cap"></i>
          </div>
          <h5 class="fw-bold text-primary m-0">Học Tiếng Anh</h5>
        </div>
      </div>

      <nav class="flex-grow-1 p-3 overflow-auto">
        <router-link to="/admin/users" class="sidebar-link">
          <i class="fas fa-users w-25 text-center"></i> Người dùng
        </router-link>
        <router-link to="/admin/lessons" class="sidebar-link">
          <i class="fas fa-book-open w-25 text-center"></i> Bài học
        </router-link>
        <router-link to="/admin/notifications" class="sidebar-link">
          <i class="fas fa-bell w-25 text-center"></i> Thông báo
        </router-link>
      </nav>

      <div class="p-3 border-top bg-light">
        <div class="d-flex align-items-center gap-3">
          <div class="bg-secondary text-white rounded-circle d-flex align-items-center justify-content-center" style="width: 40px; height: 40px;">
            A
          </div>
          <div class="flex-grow-1 overflow-hidden">
            <div class="fw-bold text-truncate">Quản Trị Viên</div>
            <button @click="logout" class="btn btn-link p-0 text-decoration-none text-muted small">
              <i class="fas fa-sign-out-alt"></i> Đăng xuất
            </button>
          </div>
        </div>
      </div>
    </aside>

    <!-- Main Content -->
    <main class="flex-grow-1 bg-body-tertiary" style="margin-left: 280px;">
      <div class="container-fluid p-4 p-lg-5">
        <router-view />
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '../stores/auth';
import { useRouter } from 'vue-router';

const authStore = useAuthStore();
const router = useRouter();

const logout = () => {
  authStore.logout();
  router.push('/login');
};
</script>
