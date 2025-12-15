<template>
  <div>
    <div class="d-flex justify-content-between align-items-center mb-4">
      <div>
        <h2 class="fw-bold text-dark">Quản Lý Người Dùng</h2>
        <p class="text-muted">Quản lý người dùng hệ thống và quản trị viên.</p>
      </div>
      
      <div class="d-flex align-items-center gap-3">
        <!-- Search Bar -->
        <div class="search-container shadow-sm d-flex align-items-center bg-white px-2">
           <input 
              v-model="searchQuery" 
              @keyup.enter="handleSearch" 
              type="text" 
              class="form-control border-0 shadow-none bg-transparent ps-2" 
              placeholder="Tìm kiếm..." 
           />
           <button @click="handleSearch" class="btn btn-dark rounded-circle btn-sm d-flex align-items-center justify-content-center" style="width: 40px; height: 40px;">
              <i class="fas fa-search text-white" style="font-size: 16px;"></i>
           </button>
        </div>

        <button @click="openCreateModal" class="btn btn-primary d-flex align-items-center" style="height: 46px;">
          <i class="fas fa-user-plus me-2"></i> Thêm Mới
        </button>
      </div>
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
                <th>Trạng Thái</th>
                <th>Ngày Tạo / Cập Nhật</th>
                <th class="text-center">Thao Tác</th>
              </tr>
            </thead>
            <tbody>
              <tr 
                v-for="user in users" 
                :key="user.id" 
                :class="{ 'table-danger': user.status === 'BLOCKED' }"
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
                  <span class="badge rounded-pill" :class="user.role === 'ADMIN' ? 'bg-warning-subtle text-warning-emphasis' : 'bg-info-subtle text-info-emphasis'">
                    {{ user.role }}
                  </span>
                </td>
                <td>
                    <span class="badge rounded-pill" :class="user.status === 'BLOCKED' ? 'bg-danger-subtle text-danger' : 'bg-success-subtle text-success'">
                        {{ user.status === 'BLOCKED' ? 'Đã Chặn' : 'Hoạt Động' }}
                    </span>
                </td>
                <td>
                    <div class="small text-muted"><i class="far fa-clock me-1"></i> Tạo: {{ new Date(user.createdAt).toLocaleString('vi-VN') }}</div>
                    <div class="small text-muted"><i class="fas fa-history me-1"></i> Cập nhật: {{ new Date(user.updatedAt).toLocaleString('vi-VN') }}</div>
                </td>
                <td class="text-center">
                    <div class="d-flex justify-content-center gap-2">
                        <button 
                            @click.stop="openMessageModal(user)" 
                            class="btn btn-outline-primary btn-sm d-flex align-items-center justify-content-center btn-icon-anim" 
                            title="Nhắn tin"
                        >
                            <i class="fas fa-comment-alt" style="font-size: 12px;"></i>
                        </button>
                        <button 
                            @click.stop="openBlockModal(user)" 
                            class="btn btn-sm d-flex align-items-center justify-content-center btn-icon-anim"
                            :class="user.status === 'BLOCKED' ? 'btn-outline-success' : 'btn-outline-warning'"
                            :title="user.status === 'BLOCKED' ? 'Mở khóa' : 'Chặn người dùng'"
                            :disabled="user.role === 'ADMIN'"
                        >
                             <i class="fas" :class="user.status === 'BLOCKED' ? 'fa-unlock' : 'fa-ban'" style="font-size: 12px;"></i>
                        </button>
                        <button 
                            @click.stop="deleteUser(user.id)" 
                            class="btn btn-outline-danger btn-sm d-flex align-items-center justify-content-center btn-icon-anim" 
                            :disabled="user.role === 'ADMIN'"
                            title="Xóa người dùng"
                        >
                            <i class="fas fa-trash-alt" style="font-size: 12px;"></i>
                        </button>
                  </div>
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
            <form @submit.prevent="handleSubmit" novalidate>
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
              <div class="mb-4">
                <label class="form-label text-muted small fw-bold">Vai trò</label>
                  <button 
                    class="btn btn-outline-secondary w-100 text-start d-flex align-items-center justify-content-between custom-select-btn ps-3 py-2" 
                    type="button" 
                    @click="toggleDropdown"
                    :aria-expanded="isDropdownOpen"
                  >
                    <span class="d-flex align-items-center">
                        <i class="fas fa-user-tag me-3 text-muted"></i>
                        <span :class="form.role === 'ADMIN' ? 'text-primary' : 'text-dark'">
                             {{ form.role === 'ADMIN' ? 'Quản Trị Viên (Admin)' : 'Học Viên (Customer)' }}
                        </span>
                    </span>
                    <i class="fas fa-chevron-down small text-muted" :class="{ 'rotate-180': isDropdownOpen }"></i>
                  </button>
                  <ul class="dropdown-menu w-100 border-0 shadow mt-1 p-1" :class="{ 'show': isDropdownOpen }">
                    <li>
                        <a 
                            class="dropdown-item py-2 rounded d-flex align-items-center justify-content-between" 
                            href="#" 
                            @click.prevent="selectRole('CUSTOMER')"
                            :class="{ 'active': form.role === 'CUSTOMER' }"
                        >
                            <span><i class="fas fa-user me-2 opacity-50"></i> Học Viên (Customer)</span>
                            <i v-if="form.role === 'CUSTOMER'" class="fas fa-check small"></i>
                        </a>
                    </li>
                    <li>
                        <a 
                            class="dropdown-item py-2 rounded d-flex align-items-center justify-content-between" 
                            href="#" 
                            @click.prevent="selectRole('ADMIN')"
                            :class="{ 'active': form.role === 'ADMIN' }"
                        >
                            <span><i class="fas fa-user-shield me-2 opacity-50"></i> Quản Trị Viên (Admin)</span>
                            <i v-if="form.role === 'ADMIN'" class="fas fa-check small"></i>
                        </a>
                    </li>
                  </ul>
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
    
    <!-- Confirm Block Modal -->
    <div class="modal fade" id="confirmBlockModal" tabindex="-1" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content border-0 shadow">
                <div class="modal-body p-4 text-center">
                    <div class="mb-3">
                        <i class="fas fa-exclamation-circle text-warning fa-3x" v-if="blockAction === 'chặn'"></i>
                        <i class="fas fa-unlock text-success fa-3x" v-else></i>
                    </div>
                    <h5 class="fw-bold mb-2">Xác nhận {{ blockAction }}</h5>
                    <p class="text-muted">Bạn có chắc chắn muốn {{ blockAction }} người dùng <span class="fw-bold text-dark">{{ selectedUser?.fullName || selectedUser?.email }}</span>?</p>
                    <div class="d-flex justify-content-center gap-2 mt-4">
                        <button type="button" class="btn btn-light px-4" data-bs-dismiss="modal">Hủy</button>
                        <button @click="confirmBlockUser" type="button" class="btn px-4" :class="blockAction === 'chặn' ? 'btn-danger' : 'btn-success'">
                            {{ blockAction === 'chặn' ? 'Chặn Ngay' : 'Mở Khóa' }}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Message User Modal -->
    <div class="modal fade" id="messageModal" tabindex="-1" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content border-0 shadow">
                <div class="modal-header border-bottom-0 pb-0">
                    <h5 class="modal-title fw-bold">Gửi Tin Nhắn</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Đóng"></button>
                </div>
                <div class="modal-body">
                    <form @submit.prevent="sendMessage">
                        <div class="mb-3">
                            <label class="form-label text-muted small fw-bold">Người nhận</label>
                            <input type="text" class="form-control bg-light" :value="selectedUser?.fullName || selectedUser?.email" readonly />
                        </div>
                        <div class="mb-3">
                            <label class="form-label text-muted small fw-bold">Nội dung tin nhắn <span class="text-danger">*</span></label>
                            <textarea v-model="messageContent" class="form-control" rows="4" placeholder="Nhập nội dung tin nhắn..." required></textarea>
                        </div>
                        <div class="d-flex justify-content-end gap-2">
                            <button type="button" class="btn btn-light text-muted" data-bs-dismiss="modal">Hủy</button>
                            <button type="submit" class="btn btn-primary px-4"><i class="fas fa-paper-plane me-2"></i> Gửi</button>
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
const searchQuery = ref('');
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

const isDropdownOpen = ref(false);

const toggleDropdown = () => {
    isDropdownOpen.value = !isDropdownOpen.value;
};

const selectRole = (role: string) => {
    form.value.role = role;
    isDropdownOpen.value = false;
};

const handleSearch = () => {
    currentPage.value = 1;
    fetchUsers(1);
};

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
    const response = await axios.get(`${import.meta.env.VITE_API_URL}/users?page=${page}&limit=20&search=${searchQuery.value}`, {
      headers: { Authorization: `Bearer ${authStore.token}` }
    });
    
    // Safely handle response structure (paginated or flat)
    if (response.data && Array.isArray(response.data.data)) {
        users.value = response.data.data;
        currentPage.value = response.data.page;
        totalPages.value = response.data.totalPages;
    } else if (Array.isArray(response.data)) {
        // Fallback for flat array response
        users.value = response.data;
    } else {
        console.warn('Unexpected API response format:', response.data);
        users.value = [];
    }
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
  isDropdownOpen.value = false;
  
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
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
  if (!form.value.email) {
    formErrors.value.email = 'Vui lòng nhập địa chỉ email.';
    isValid = false;
  } else if (!emailRegex.test(form.value.email)) {
    formErrors.value.email = 'Địa chỉ email không hợp lệ.';
    isValid = false;
  }

  if (!form.value.password && !isEditing.value) {
    formErrors.value.password = 'Vui lòng nhập mật khẩu.';
    isValid = false;
  } else if (form.value.password && form.value.password.length < 6) {
    formErrors.value.password = 'Mật khẩu phải có ít nhất 6 ký tự.';
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
          await axios.patch(`${import.meta.env.VITE_API_URL}/users/${editingId.value}`, formData, {
              headers: { Authorization: `Bearer ${authStore.token}` }
          });
          toastStore.success('Cập nhật người dùng thành công!');
      } else {
          await axios.post(`${import.meta.env.VITE_API_URL}/users`, formData, {
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

const selectedUser = ref<any>(null);
const blockAction = ref('');
const messageContent = ref('');

const openBlockModal = (user: any) => {
    selectedUser.value = user;
    blockAction.value = user.status === 'BLOCKED' ? 'mở khóa' : 'chặn';
    const modalEl = document.getElementById('confirmBlockModal');
    if (modalEl) new Modal(modalEl).show();
}

const confirmBlockUser = async () => {
    if (!selectedUser.value) return;
    const newStatus = selectedUser.value.status === 'BLOCKED' ? 'ACTIVE' : 'BLOCKED';
    
    try {
        await axios.patch(`${import.meta.env.VITE_API_URL}/users/${selectedUser.value.id}/status`, { status: newStatus }, {
            headers: { Authorization: `Bearer ${authStore.token}` }
        });
        toastStore.success(`Đã ${blockAction.value} người dùng thành công.`);
        fetchUsers(currentPage.value);
        
        // Hide Modal
        const modalEl = document.getElementById('confirmBlockModal');
        if (modalEl) Modal.getInstance(modalEl)?.hide();
    } catch (error) {
        console.error('Lỗi cập nhật trạng thái:', error);
        toastStore.error('Không thể cập nhật trạng thái.');
    }
};

const openMessageModal = (user: any) => {
    selectedUser.value = user;
    messageContent.value = '';
    const modalEl = document.getElementById('messageModal');
    if (modalEl) new Modal(modalEl).show();
}

const sendMessage = async () => {
    if (!messageContent.value.trim()) return;
    loading.value = true;
    try {
        // Assuming there is a notifications endpoint
        await axios.post(`${import.meta.env.VITE_API_URL}/notifications`, {
            receiverId: selectedUser.value.id,
            title: 'Tin nhắn từ Quản trị viên',
            message: messageContent.value,
            type: 'SYSTEM'
        }, {
            headers: { Authorization: `Bearer ${authStore.token}` }
        });
        
        toastStore.success('Đã gửi tin nhắn thành công.');
        const modalEl = document.getElementById('messageModal');
        if (modalEl) Modal.getInstance(modalEl)?.hide();
    } catch (error) {
        console.error('Error sending message:', error);
        toastStore.error('Không thể gửi tin nhắn.');
    } finally {
        loading.value = false;
    }
}

// Keep deleteUser below
const deleteUser = async (id: number) => {
  if (!confirm('Bạn có chắc chắn muốn xóa người dùng này?')) return;
  try {
    await axios.delete(`${import.meta.env.VITE_API_URL}/users/${id}`, {
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
.user-cell {
  transition: all 0.2s ease;
}

.user-cell:hover {
  cursor: pointer;
  background-color: rgba(13, 110, 253, 0.08); /* More visible blue tint */
}

/* Icon Rotation */
.rotate-180 {
    transform: rotate(180deg);
    transition: transform 0.2s ease;
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

/* Custom Select Style via Bootstrap Dropdown */
.custom-select-btn {
  border-radius: 8px;
  border-color: #dee2e6;
  background-color: #f8f9fa;
  color: #495057;
  transition: all 0.2s ease;
}

.custom-select-btn:hover, .custom-select-btn:focus, .custom-select-btn[aria-expanded="true"] {
  background-color: #fff;
  border-color: #86b7fe;
  box-shadow: 0 0 0 0.25rem rgba(13, 110, 253, 0.15);
  color: #212529;
}

.dropdown-item {
    transition: all 0.15s ease;
    font-weight: 500;
    cursor: pointer; /* Ensure pointer cursor */
}

.dropdown-item.active, .dropdown-item:active {
    background-color: #0d6efd !important; /* Force active color */
    color: white !important;
}

.dropdown-item:hover {
    background-color: #e9ecef !important; /* Force hover color */
    color: #1e2125 !important;
}

/* Search Container Style matching the image */
.search-container {
    border-radius: 50px; /* Pillow shape */
    height: 46px;
    width: 400px;
    transition: all 0.3s ease;
    border: 1px solid #dee2e6;
}

.search-container:focus-within {
   box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08) !important;
   border-color: #adb5bd;
}

.search-container input::placeholder {
    color: #adb5bd;
    font-size: 0.95rem;
}
</style>
