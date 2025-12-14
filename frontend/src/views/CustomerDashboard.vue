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
        <router-link to="/dashboard" class="sidebar-link">
          <i class="fas fa-home w-25 text-center"></i> Trang Chủ
        </router-link>
        <router-link to="/lessons" class="sidebar-link">
          <i class="fas fa-headphones w-25 text-center"></i> Bài Học
        </router-link>
        <router-link to="/notifications" class="sidebar-link">
          <i class="fas fa-bell w-25 text-center"></i> Thông Báo
        </router-link>
         <router-link to="/profile" class="sidebar-link">
          <i class="fas fa-user-circle w-25 text-center"></i> Hồ Sơ
        </router-link>
      </nav>

      <div class="p-3 border-top bg-light">
        <div class="d-flex align-items-center gap-3">
          <div class="bg-secondary text-white rounded-circle d-flex align-items-center justify-content-center" style="width: 40px; height: 40px;">
            U
          </div>
          <div class="flex-grow-1 overflow-hidden">
            <div class="fw-bold text-truncate">Học Viên</div>
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
