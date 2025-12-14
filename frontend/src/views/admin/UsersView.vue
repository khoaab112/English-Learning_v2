<template>
  <div>
    <div class="d-flex justify-content-between align-items-center mb-4">
      <div>
        <h2 class="fw-bold text-dark">Quản Lý Người Dùng</h2>
        <p class="text-muted">Quản lý người dùng hệ thống và quản trị viên.</p>
      </div>
      <button @click="openCreateModal" class="btn btn-primary">
        <i class="fas fa-user-plus me-2"></i> Thêm Người Dùng
      </button>
    </div>

    <!-- User Table -->
    <div class="card border-0 shadow-sm">
      <div class="card-body p-0">
        <div class="table-responsive">
          <table class="table table-hover table-striped align-middle mb-0">
            <thead class="bg-light text-muted small text-uppercase">
              <tr>
                <th class="ps-4">ID</th>
                <th>Người Dùng</th>
                <th>Vai Trò</th>
                <th>Ngày Tham Gia</th>
                <th class="text-center">Thao Tác</th>
              </tr>
            </thead>
            <tbody>
              <tr 
                v-for="user in users" 
                :key="user.id" 
              >
                <td class="ps-4 fw-bold">#{{ user.id }}</td>
                <td @click="openEditModal(user)" role="button" class="user-cell">
                  <div class="d-flex align-items-center">
                    <!-- Avatar -->
                    <img 
                      v-if="user.avatar" 
                      :src="user.avatar" 
                      class="rounded-circle me-3 border" 
                      style="width: 40px; height: 40px; object-fit: cover;"
                      alt="Avatar"
                    >
                    <div 
                      v-else 
                      class="rounded-circle bg-primary-subtle text-primary d-flex align-items-center justify-content-center me-3 fw-bold" 
                      style="width: 40px; height: 40px"
                    >
                      {{ getInitials(user.fullName || user.email) }}
                    </div>
                    
                    <!-- Name & Email -->
                    <div>
                      <div class="fw-bold text-dark">{{ user.fullName || 'Chưa đặt tên' }}</div>
                      <div class="small text-muted">{{ user.email }}</div>
                    </div>
                  </div>
                </td>
                <td>
                  <span class="badge rounded-pill" :class="user.role === 'ADMIN' ? 'bg-warning-subtle text-warning-emphasis' : 'bg-secondary-subtle text-secondary'">
                    {{ user.role }}
                  </span>
                </td>
                <td class="text-muted">{{ new Date(user.createdAt).toLocaleDateString() }}</td>
                <td class="text-center">
                  <button 
                    @click="deleteUser(user.id)" 
                    class="btn btn-outline-danger d-flex align-items-center justify-content-center btn-icon-anim mx-auto" 
                    :disabled="user.role === 'ADMIN'"
                    title="Xóa người dùng"
                  >
                    <i class="fas fa-trash-alt" style="font-size: 12px;"></i>
                  </button>
                </td>
              </tr>
              <tr v-if="users.length === 0">
                <td colspan="5" class="text-center py-5 text-muted">
                  <i class="fas fa-users-slash fa-2x mb-3"></i>
                  <p>Không tìm thấy người dùng</p>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      
      <!-- Pagination Controls -->
      <div v-if="totalPages > 1" class="card-footer bg-white py-3 border-top-0 d-flex justify-content-end">
         <nav>
           <ul class="pagination custom-pagination mb-0 gap-2">
             <li class="page-item" :class="{ disabled: currentPage === 1 }">
               <button class="page-link" @click="fetchUsers(currentPage - 1)">
                 <i class="fas fa-chevron-left"></i>
               </button>
             </li>
             <li 
               v-for="page in totalPages" 
               :key="page" 
               class="page-item" 
               :class="{ active: page === currentPage }"
             >
               <button class="page-link" @click="fetchUsers(page)">{{ page }}</button>
             </li>
             <li class="page-item" :class="{ disabled: currentPage === totalPages }">
               <button class="page-link" @click="fetchUsers(currentPage + 1)">
                 <i class="fas fa-chevron-right"></i>
               </button>
             </li>
           </ul>
         </nav>
      </div>
    </div>

    <!-- User Modal (Create / Edit) -->
    <div class="modal fade" id="userModal" tabindex="-1" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content border-0 shadow">
          <div class="modal-header border-bottom-0 pb-0">
            <h5 class="modal-title fw-bold">{{ isEditing ? 'Cập Nhật Người Dùng' : 'Thêm Người Dùng Mới' }}</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Đóng"></button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="handleSubmit">
              <!-- Full Name -->
              <div class="mb-3">
                <label class="form-label text-muted small fw-bold">Họ và Tên</label>
                <input v-model="form.fullName" type="text" class="form-control" :class="{'is-invalid': formErrors.fullName}" placeholder="Nguyễn Văn A" @input="formErrors.fullName = ''" />
                <div v-if="formErrors.fullName" class="invalid-feedback">{{ formErrors.fullName }}</div>
              </div>

              <!-- Avatar Selection Tabs -->
              <div class="mb-3">
                <label class="form-label text-muted small fw-bold">Ảnh Đại Diện</label>
                <div class="nav nav-tabs mb-3">
                  <button 
                    type="button" 
                    class="nav-link" 
                    :class="{ active: avatarMode === 'url' }"
                    @click="avatarMode = 'url'"
                  >Link URL</button>
                  <button 
                    type="button" 
                    class="nav-link" 
                    :class="{ active: avatarMode === 'file' }"
                    @click="avatarMode = 'file'"
                  >Tải Ảnh Lên</button>
                </div>

                <div v-if="avatarMode === 'url'">
                   <input v-model="form.avatar" type="url" class="form-control" placeholder="https://example.com/avatar.jpg" />
                   <div v-if="form.avatar" class="mt-2 text-center">
                     <img :src="form.avatar" class="rounded-circle border" style="width: 60px; height: 60px; object-fit: cover;" />
                   </div>
                </div>

                <div v-if="avatarMode === 'file'">
                   <input type="file" class="form-control" @change="handleFileChange" accept="image/*" />
                   <div v-if="previewUrl" class="mt-2 text-center">
                     <img :src="previewUrl" class="rounded-circle border" style="width: 60px; height: 60px; object-fit: cover;" />
                   </div>
                </div>
              </div>

              <!-- Email -->
              <div class="mb-3">
                <label class="form-label text-muted small fw-bold">Email <span class="text-danger">*</span></label>
                <input v-model="form.email" type="email" class="form-control" :class="{'is-invalid': formErrors.email}" placeholder="email@example.com" required :disabled="isEditing" @input="formErrors.email = ''" />
                <div v-if="formErrors.email" class="invalid-feedback">{{ formErrors.email }}</div>
              </div>
              
              <!-- Password -->
              <div class="mb-3">
                <label class="form-label text-muted small fw-bold">Mật khẩu {{ isEditing ? '(Để trống nếu không đổi)' : '' }}</label>
                <input v-model="form.password" type="password" class="form-control" :class="{'is-invalid': formErrors.password}" placeholder="••••••••" :required="!isEditing" @input="formErrors.password = ''" />
                <div v-if="formErrors.password" class="invalid-feedback">{{ formErrors.password }}</div>
              </div>

              <!-- Role -->
              <div class="mb-3">
                <label class="form-label text-muted small fw-bold">Vai trò</label>
                <select v-model="form.role" class="form-select">
                  <option value="CUSTOMER">Học Viên (Customer)</option>
                  <option value="ADMIN">Quản Trị Viên (Admin)</option>
                </select>
              </div>

              <div class="d-flex justify-content-end gap-2">
                <button type="button" class="btn btn-light text-muted" data-bs-dismiss="modal">Hủy</button>
                <button type="submit" class="btn btn-primary px-4">{{ isEditing ? 'Lưu Thay Đổi' : 'Tạo Mới' }}</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
    
    <LoadingSpinner :loading="loading" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { useAuthStore } from '../../stores/auth';
import { useToastStore } from '../../stores/toast';
import { Modal } from 'bootstrap';
import LoadingSpinner from '../../components/common/LoadingSpinner.vue';

const users = ref<any[]>([]);
const currentPage = ref(1);
const totalPages = ref(1);
const loading = ref(false);
const authStore = useAuthStore();
const toastStore = useToastStore();
const isEditing = ref(false);
const editingId = ref<number | null>(null);
const avatarMode = ref<'url' | 'file'>('url');
const selectedFile = ref<File | null>(null);
const previewUrl = ref('');

const form = ref({
  email: '',
  password: '',
  fullName: '',
  avatar: '',
  role: 'CUSTOMER'
});

const formErrors = ref({
  email: '',
  password: '',
  fullName: '',
  avatar: '',
  role: ''
});

const getInitials = (name: string) => {
  return name ? name.charAt(0).toUpperCase() : 'U';
};

const handleFileChange = (event: any) => {
  const file = event.target.files[0];
  if (file) {
    selectedFile.value = file;
    // Create preview URL
    const reader = new FileReader();
    reader.onload = (e: any) => previewUrl.value = e.target.result;
    reader.readAsDataURL(file);
  }
};

const fetchUsers = async (page: number = 1) => {
  loading.value = true;
  try {
    const response = await axios.get(`http://localhost:3000/users?page=${page}&limit=5`, {
      headers: { Authorization: `Bearer ${authStore.token}` }
    });
    // Response structure now: { data: [], total: number, page: number, totalPages: number }
    users.value = response.data.data;
    currentPage.value = response.data.page;
    totalPages.value = response.data.totalPages;
  } catch (error) {
    console.error('Error fetching users:', error);
    toastStore.error('Không thể tải danh sách người dùng.');
  } finally {
    loading.value = false;
  }
};

const openCreateModal = () => {
  isEditing.value = false;
  editingId.value = null;
  selectedFile.value = null;
  previewUrl.value = '';
  avatarMode.value = 'url';
  formErrors.value = { email: '', password: '', fullName: '', avatar: '', role: '' };
  form.value = { email: '', password: '', fullName: '', avatar: '', role: 'CUSTOMER' };
  
  const modalEl = document.getElementById('userModal');
  if (modalEl) new Modal(modalEl).show();
};

const openEditModal = (user: any) => {
  isEditing.value = true;
  editingId.value = user.id;
  selectedFile.value = null;
  previewUrl.value = '';
  avatarMode.value = 'url';
  
  form.value = {
      email: user.email,
      password: '',
      fullName: user.fullName || '',
      avatar: user.avatar || '',
      role: user.role
  };

  const modalEl = document.getElementById('userModal');
  if (modalEl) new Modal(modalEl).show();
};

const handleSubmit = async () => {
  // Client-side Validation
  let isValid = true;
  if (!form.value.email) {
    formErrors.value.email = 'Vui lòng nhập địa chỉ email.';
    isValid = false;
  }
  if (!form.value.password && !isEditing.value) {
    formErrors.value.password = 'Vui lòng nhập mật khẩu.';
    isValid = false;
  }
  if (!isValid) return;

  const formData = new FormData();
  formData.append('email', form.value.email);
  formData.append('role', form.value.role);
  if (form.value.fullName) formData.append('fullName', form.value.fullName);
  if (form.value.password) formData.append('password', form.value.password);
  
  if (avatarMode.value === 'file' && selectedFile.value) {
    formData.append('file', selectedFile.value);
  } else if (avatarMode.value === 'url' && form.value.avatar) {
    formData.append('avatar', form.value.avatar);
  }

  try {
      if (isEditing.value && editingId.value) {
          await axios.patch(`http://localhost:3000/users/${editingId.value}`, formData, {
              headers: { Authorization: `Bearer ${authStore.token}` }
          });
          toastStore.success('Cập nhật người dùng thành công!');
      } else {
          await axios.post('http://localhost:3000/users', formData, {
               headers: { Authorization: `Bearer ${authStore.token}` }
          });
          toastStore.success('Tạo người dùng mới thành công!');
      }
      
      closeModal();
      fetchUsers(currentPage.value); 
  } catch (error: any) {
      console.error('Lỗi lưu:', error);
      if (error.response && error.response.status === 409) {
          formErrors.value.email = 'Email này đã được sử dụng.';
      } else if (error.response && error.response.data && Array.isArray(error.response.data.message)) {
          // NestJS class-validator default error structure
          error.response.data.message.forEach((msg: string) => {
              if (msg.includes('email')) formErrors.value.email = msg;
              if (msg.includes('password')) formErrors.value.password = msg;
              if (msg.includes('fullName')) formErrors.value.fullName = msg;
          });
      } else {
        toastStore.error('Thất bại. Vui lòng kiểm tra lại thông tin.');
      }
  }
};

const closeModal = () => {
    const modalEl = document.getElementById('userModal');
    if (modalEl) {
        const modal = Modal.getInstance(modalEl);
        modal?.hide();
    }
}

const deleteUser = async (id: number) => {
  if (!confirm('Bạn có chắc chắn muốn xóa người dùng này?')) return;
  try {
    await axios.delete(`http://localhost:3000/users/${id}`, {
        headers: { Authorization: `Bearer ${authStore.token}` }
    });
    toastStore.success('Đã xóa người dùng.');
    // Adjust logic: if deleting last item on page, go back
    if (users.value.length === 1 && currentPage.value > 1) {
        fetchUsers(currentPage.value - 1);
    } else {
        fetchUsers(currentPage.value);
    }
  } catch (error) {
    console.error('Lỗi khi xóa người dùng:', error);
    toastStore.error('Không thể xóa người dùng này.');
  }
};

onMounted(() => fetchUsers(1));
</script>

<style scoped>
.user-cell:hover {
  cursor: pointer;
  background-color: rgba(0,0,0,0.02);
}

.btn-icon-anim {
  width: 34px;
  height: 28px;
  padding: 0px;
  border-radius: 4px;
  transition: transform 0.1s ease, box-shadow 0.1s ease;
}

.btn-icon-anim:active {
  transform: translateY(2px);
  box-shadow: inset 0 3px 5px rgba(0,0,0,0.125);
}

/* Custom Circular Pagination */
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
  background-color: #3b82f6; /* Custom Blue to match image */
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
