<template>
  <div class="d-flex align-items-center justify-content-center min-vh-100 bg-light">
    <div class="card shadow-soft p-4 p-md-5" style="max-width: 450px; width: 100%;">
      <div class="text-center mb-4">
        <h1 class="h3 fw-bold mb-1 text-primary">Học Tiếng Anh</h1>
        <p class="text-muted">Chào mừng trở lại! Vui lòng đăng nhập.</p>
      </div>

      <form @submit.prevent="handleLogin">
        <div class="mb-3">
          <label class="form-label fw-bold small text-uppercase text-muted">Địa chỉ Email</label>
          <div class="input-group">
            <span class="input-group-text bg-light border-0"><i class="fas fa-envelope text-muted"></i></span>
            <input v-model="email" type="email" class="form-control bg-light border-0" placeholder="ten@example.com" required />
          </div>
        </div>

        <div class="mb-4">
          <label class="form-label fw-bold small text-uppercase text-muted">Mật khẩu</label>
          <div class="input-group">
            <span class="input-group-text bg-light border-0"><i class="fas fa-lock text-muted"></i></span>
            <input v-model="password" type="password" class="form-control bg-light border-0" placeholder="••••••••" required />
          </div>
        </div>

        <button type="submit" class="btn btn-primary w-100 py-2 shadow-sm" :disabled="loading">
          <i class="fas fa-sign-in-alt me-2"></i> {{ loading ? 'Đang đăng nhập...' : 'Đăng Nhập' }}
        </button>
      </form>

      <div v-if="error" class="alert alert-danger mt-4 d-flex align-items-center" role="alert">
        <i class="fas fa-exclamation-circle me-2"></i>
        <div>{{ error }}</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useAuthStore } from '../stores/auth';
import { useRouter } from 'vue-router';

const email = ref('');
const password = ref('');
const error = ref('');
const loading = ref(false);
const authStore = useAuthStore();
const router = useRouter();

const handleLogin = async () => {
  loading.value = true;
  error.value = '';
  try {
    await authStore.login(email.value, password.value);
    if (authStore.user?.role === 'ADMIN') {
      router.push('/admin/users');
    } else {
      router.push('/dashboard');
    }
  } catch (err: any) {
    error.value = err.response?.data?.message || 'Email hoặc mật khẩu không đúng';
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.input-group-text {
  border-top-right-radius: 0;
  border-bottom-right-radius: 0;
}
.form-control {
  border-top-left-radius: 0;
  border-bottom-left-radius: 0;
}
</style>
