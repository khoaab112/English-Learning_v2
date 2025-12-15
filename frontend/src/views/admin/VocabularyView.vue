<template>
  <div class="container-fluid py-4">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <div>
        <h2 class="fw-bold text-dark mb-1">Quản Lý Từ Vựng</h2>
        <p class="text-muted mb-0">Hệ thống từ vựng phong phú với âm thanh, hình ảnh và ví dụ chi tiết.</p>
      </div>
      <div class="d-flex gap-2">
        <button class="btn btn-outline-primary d-flex align-items-center gap-2 shadow-sm px-3 py-2" data-bs-toggle="modal" data-bs-target="#tagsModal">
            <i class="fas fa-tags"></i>
            <span>Quản Lý Tags</span>
        </button>
        <button class="btn btn-primary d-flex align-items-center gap-2 shadow-sm px-4 py-2" @click="openModal">
            <i class="fas fa-plus"></i>
            <span>Thêm Từ Mới</span>
        </button>
      </div>
    </div>

    <!-- ... (Main Card content same as before until table row) ... -->
    <!-- I will overwrite the main card content to update the table rendering of tags -->

    <div class="card border-0 shadow-sm">
        <div class="card-header bg-white py-3 border-bottom-0">
             <!-- Filters Row (Same) -->
            <div class="row g-3 justify-content-end align-items-center mb-3">
                 <div class="col-md-2">
                     <select v-model="selectedLevel" class="form-select bg-light border-0 fw-bold text-secondary" style="cursor: pointer;">
                         <option value="">📶 Tất cả Level</option>
                         <option value="A1">Level A1</option>
                         <option value="A2">Level A2</option>
                         <option value="B1">Level B1</option>
                         <option value="B2">Level B2</option>
                         <option value="C1">Level C1</option>
                     </select>
                </div>
                <!-- ... (Type Dropdown Same) ... -->
                <div class="col-md-3">
                    <div class="dropdown">
                        <button 
                            class="btn w-100 d-flex justify-content-between align-items-center fw-bold border"
                            :class="selectedType ? getTypeBadgeClass(selectedType) : 'bg-light text-secondary'"
                            type="button" 
                            data-bs-toggle="dropdown" 
                            aria-expanded="false"
                        >
                            {{ selectedType ? getTypeLabel(selectedType) : '📚 Tất cả loại từ' }}
                            <i class="fas fa-chevron-down small opacity-75"></i>
                        </button>
                        <ul class="dropdown-menu w-100 p-1 border-0 shadow mt-1">
                            <li><a class="dropdown-item rounded mb-1 bg-light text-dark" href="#" @click.prevent="selectedType = ''">📚 Tất cả loại từ</a></li>
                            <li><a class="dropdown-item rounded mb-1" :class="getTypeBadgeClass('n')" href="#" @click.prevent="selectedType = 'n'">Danh từ (n)</a></li>
                            <li><a class="dropdown-item rounded mb-1" :class="getTypeBadgeClass('v')" href="#" @click.prevent="selectedType = 'v'">Động từ (v)</a></li>
                            <li><a class="dropdown-item rounded mb-1" :class="getTypeBadgeClass('adj')" href="#" @click.prevent="selectedType = 'adj'">Tính từ (adj)</a></li>
                            <li><a class="dropdown-item rounded mb-1" :class="getTypeBadgeClass('adv')" href="#" @click.prevent="selectedType = 'adv'">Trạng từ (adv)</a></li>
                        </ul>
                    </div>
                </div>
                <div class="col-md-4">
                    <CommonSearch v-model="searchQuery" @search="fetchWords" placeholder="Tìm kiếm từ vựng..." />
                </div>
            </div>

            <!-- Legend Row (Same) -->
            <div class="d-flex gap-3 align-items-center flex-wrap">
                <span class="text-muted fw-bold small me-2">Chú thích:</span>
                <span class="badge bg-primary-subtle text-primary border border-primary-subtle px-3 py-2">n: Danh từ</span>
                <span class="badge bg-success-subtle text-success border border-success-subtle px-3 py-2">v: Động từ</span>
                <span class="badge bg-warning-subtle text-warning-emphasis border border-warning-subtle px-3 py-2">adj: Tính từ</span>
                <span class="badge bg-info-subtle text-info-emphasis border border-info-subtle px-3 py-2">adv: Trạng từ</span>
            </div>
        </div>
      <div class="card-body p-0">
        <div class="table-responsive">
          <table class="table table-hover align-middle mb-0">
            <!-- Header Same -->
            <thead class="bg-light text-muted small text-uppercase">
              <tr>
                <th class="ps-4">Hình ảnh</th>
                <th>Từ Vựng / IPA</th>
                <th>Level</th>
                <th>Nghĩa / Ví dụ</th>
                <th>Thông tin thêm</th>
                <th class="text-end pe-4">Thao Tác</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="word in words" :key="word.id">
                <td class="ps-4">
                    <div class="ratio ratio-1x1 bg-light rounded border" style="width: 50px; height: 50px; background-size: cover; background-position: center;" :style="{ backgroundImage: `url(${word.imageUrl || 'https://placehold.co/50x50?text=No+Img'})` }"></div>
                </td>
                <td>
                    <div class="d-flex flex-column">
                        <span class="fw-bold text-dark fs-6">{{ word.word }}</span>
                        <span class="text-muted small font-monospace">{{ word.ipa }}</span>
                        <span class="badge rounded-pill border w-auto mt-1" :class="getTypeBadgeClass(word.type)" style="width: fit-content;">{{ word.type }}</span>
                    </div>
                </td>
                <td>
                    <span class="badge rounded-pill px-3" :class="getLevelBadgeClass(word.level)">{{ word.level }}</span>
                </td>
                <td>
                    <div class="mb-1 fw-bold text-dark">{{ word.meaning }}</div>
                    <div class="text-muted small fst-italic text-truncate" style="max-width: 250px;">
                        "{{ word.example }}"
                    </div>
                </td>
                <td>
                    <!-- Updated Tag Loop -->
                    <div class="d-flex flex-wrap gap-1" style="max-width: 200px;">
                        <span v-for="tag in (word.tags || [])" :key="tag.id" class="badge border" :class="getTagColor(tag.id)" :title="tag.note">#{{ tag.name }}</span>
                    </div>
                </td>
                <td class="text-end pe-4">
                  <button @click="editWord(word)" class="btn btn-sm btn-link text-primary p-0 me-3" title="Sửa">
                    <i class="fas fa-edit"></i>
                  </button>
                  <button @click="deleteWord(word.id!)" class="btn btn-sm btn-link text-danger p-0" title="Xóa">
                    <i class="fas fa-trash-alt"></i>
                  </button>
                </td>
              </tr>
              <!-- Loading/Empty Same -->
              <tr v-if="loading">
                  <td colspan="6" class="text-center py-5">
                      <div class="spinner-border text-primary" role="status"></div>
                  </td>
              </tr>
              <tr v-else-if="words.length === 0">
                <td colspan="6" class="text-center py-5 text-muted">
                  <i class="fas fa-spell-check fa-2x mb-3"></i>
                  <p>Không tìm thấy từ vựng nào</p>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div class="card-footer bg-white py-3 border-top-0 d-flex justify-content-end">
            <CommonPagination 
                :current-page="currentPage" 
                :total-pages="totalPages" 
                :total="totalWords" 
                :limit="limit" 
                @page-change="onPageChange"
            />
      </div>
    </div>

    <!-- Tags Management Modal -->
    <Teleport to="body">
        <div class="modal fade" id="tagsModal" tabindex="-1" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content border-0 shadow">
                    <div class="modal-header border-bottom-0">
                        <h5 class="modal-title fw-bold">Quản Lý Tags</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                         <div class="card bg-light border-0 p-3 mb-3">
                            <h6 class="fw-bold mb-3 text-primary">Thêm Tag Mới</h6>
                             <div class="row g-2 align-items-end">
                                <div class="col-md-5">
                                    <label class="small text-muted fw-bold mb-1">Tên Tag</label>
                                    <input v-model="tagForm.name" class="form-control border-secondary-subtle shadow-sm" placeholder="VD: school" />
                                </div>
                                <div class="col-md-5">
                                    <label class="small text-muted fw-bold mb-1">Ghi chú</label>
                                    <input v-model="tagForm.note" class="form-control border-secondary-subtle shadow-sm" placeholder="VD: Từ vựng trường học" />
                                </div>
                                <div class="col-md-2">
                                    <button class="btn btn-primary w-100 fw-bold shadow-sm" style="padding: 0.6rem;" @click="saveTag">
                                        <i class="fas fa-plus"></i> Tạo
                                    </button>
                                </div>
                             </div>
                         </div>
                         <div class="d-flex flex-wrap gap-2 border-top pt-3" style="max-height: 300px; overflow-y: auto;">
                             <div v-for="tag in allTags" :key="tag.id" class="border p-2 rounded-3 d-flex align-items-center shadow-sm" :class="getTagColor(tag.id)" style="border-radius: 8px !important;">
                                 <div class="me-2">
                                     <span class="fw-bold">{{ tag.name }}</span>
                                     <!-- <small class="text-muted d-block small" v-if="tag.note" style="font-size: 0.75rem;">{{ tag.note }}</small> -->
                                 </div>
                                 <button class="btn btn-sm btn-link text-danger p-0 ms-2" @click="deleteTag(tag.id!)" title="Xóa">
                                     <i class="fas fa-times"></i>
                                 </button>
                             </div>
                             <div v-if="allTags.length === 0" class="w-100 text-center text-muted py-3">Chưa có tag nào</div>
                         </div>
                    </div>
                </div>
            </div>
        </div>
    </Teleport>

    <!-- Word Modal (Tab 3 Updated) -->
    <Teleport to="body">
        <div class="modal fade" id="vocabularyModal" tabindex="-1" aria-hidden="true" ref="modalElement">
        <div class="modal-dialog modal-dialog-centered modal-lg">
            <div class="modal-content border-0 shadow">
            
            <!-- Modal Header -->
            <div class="modal-header border-bottom-0 pb-0">
                <div class="d-flex align-items-center">
                    <button v-if="creationMode === 'MANUAL' && !isEditing" @click="creationMode = 'SELECT'" class="btn btn-sm btn-light me-2 rounded-circle" title="Quay lại">
                        <i class="fas fa-arrow-left"></i>
                    </button>
                    <h5 class="modal-title fw-bold">
                        {{ 
                            creationMode === 'SELECT' ? 'Chọn cách thêm từ' : 
                            (isEditing ? 'Cập nhật từ vựng' : 'Thêm từ mới thủ công') 
                        }}
                    </h5>
                </div>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Đóng"></button>
            </div>

            <!-- Modal Body -->
            <div class="modal-body">
                
                <!-- MODE SELECTION -->
                <div v-if="creationMode === 'SELECT'" class="row g-4 py-4 px-2">
                    <div class="col-md-6">
                        <div class="card h-100 border text-center p-4 hover-card cursor-pointer" @click="creationMode = 'MANUAL'">
                            <div class="card-body">
                                <div class="bg-primary-subtle text-primary rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style="width: 60px; height: 60px;">
                                    <i class="fas fa-pen-fancy fa-2x"></i>
                                </div>
                                <h5 class="fw-bold">Thủ Công</h5>
                                <p class="text-muted small">Nhập chi tiết từng trường thông tin cho một từ vựng mới.</p>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-6">
                        <div class="card h-100 border text-center p-4 hover-card cursor-pointer" @click="creationMode = 'TEMPLATE'"> 
                             <!-- Future: Implement Template Mode -->
                            <div class="card-body">
                                <div class="bg-success-subtle text-success rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style="width: 60px; height: 60px;">
                                    <i class="fas fa-magic fa-2x"></i>
                                </div>
                                <h5 class="fw-bold">Dùng Template</h5>
                                <p class="text-muted small">Sử dụng mẫu có sẵn để tạo từ vựng nhanh chóng (Sắp ra mắt).</p>
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- TEMPLATE PLACEHOLDER -->
                <div v-else-if="creationMode === 'TEMPLATE'" class="text-center py-5">
                    <div class="text-muted mb-3"><i class="fas fa-tools fa-3x"></i></div>
                    <h5>Tính năng đang phát triển</h5>
                    <button class="btn btn-outline-primary mt-2" @click="creationMode = 'SELECT'">Quay lại</button>
                </div>

                <!-- MANUAL FORM (Key Existing Logic) -->
                <div v-else-if="creationMode === 'MANUAL'">
                    <ul class="nav nav-tabs nav-fill mb-3" id="vocabTabs" role="tablist">
                        <li class="nav-item" role="presentation">
                            <button class="nav-link active fw-bold small" id="general-tab" data-bs-toggle="tab" data-bs-target="#general" type="button" role="tab" aria-controls="general" aria-selected="true">
                                Thông Tin Chung
                            </button>
                        </li>
                        <li class="nav-item" role="presentation">
                            <button class="nav-link fw-bold small" id="details-tab" data-bs-toggle="tab" data-bs-target="#details" type="button" role="tab" aria-controls="details" aria-selected="false">
                                Ví Dụ & Ghi Chú
                            </button>
                        </li>
                        <li class="nav-item" role="presentation">
                            <button class="nav-link fw-bold small" id="media-tab" data-bs-toggle="tab" data-bs-target="#media" type="button" role="tab" aria-controls="media" aria-selected="false">
                                Media & Tags
                            </button>
                        </li>
                    </ul>

                    <form @submit.prevent="saveWord">
                        <div class="tab-content" id="myTabContent">
                            <!-- Tab 1: General Info (Same) -->
                            <div class="tab-pane fade show active" id="general" role="tabpanel" aria-labelledby="general-tab">
                                 <div class="row g-3">
                                    <div class="col-md-6">
                                        <label class="form-label text-muted small fw-bold">Từ Tiếng Anh <span class="text-danger">*</span></label>
                                        <input v-model="form.word" class="form-control" placeholder="VD: Opportunity" required />
                                    </div>
                                    <div class="col-md-6">
                                        <label class="form-label text-muted small fw-bold">Phiên Âm (IPA)</label>
                                        <input v-model="form.ipa" class="form-control font-monospace" placeholder="/ˌɒpəˈtjuːnəti/" />
                                    </div>
                                    <div class="col-12">
                                        <label class="form-label text-muted small fw-bold">Nghĩa Tiếng Việt <span class="text-danger">*</span></label>
                                        <input v-model="form.meaning" class="form-control" placeholder="Cơ hội, thời cơ" required />
                                    </div>
                                    <div class="col-md-6">
                                        <label class="form-label text-muted small fw-bold">Loại Từ</label>
                                        <select v-model="form.type" class="form-select">
                                            <option value="n">Noun (n)</option>
                                            <option value="v">Verb (v)</option>
                                            <option value="adj">Adjective (adj)</option>
                                            <option value="adv">Adverb (adv)</option>
                                            <option value="prep">Preposition</option>
                                            <option value="conj">Conjunction</option>
                                        </select>
                                    </div>
                                    <div class="col-md-6">
                                        <label class="form-label text-muted small fw-bold">Level</label>
                                        <select v-model="form.level" class="form-select">
                                            <option value="A1">A1 - Beginner</option>
                                            <option value="A2">A2 - Elementary</option>
                                            <option value="B1">B1 - Intermediate</option>
                                            <option value="B2">B2 - Upper Intermediate</option>
                                            <option value="C1">C1 - Advanced</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            <!-- Tab 2: Details (Same) -->
                            <div class="tab-pane fade" id="details" role="tabpanel" aria-labelledby="details-tab">
                                 <div class="mb-3">
                                    <label class="form-label text-muted small fw-bold">Câu Ví Dụ (EN)</label>
                                    <textarea v-model="form.example" class="form-control" rows="2" placeholder="He seized the opportunity to speak."></textarea>
                                </div>
                                <div class="mb-3">
                                    <label class="form-label text-muted small fw-bold">Dịch Nghĩa Ví Dụ (VN)</label>
                                    <textarea v-model="form.exampleMeaning" class="form-control" rows="2" placeholder="Anh ấy nắm lấy cơ hội để phát biểu."></textarea>
                                </div>
                                <div class="mb-3">
                                    <label class="form-label text-muted small fw-bold">Ghi Chú Sử Dụng (Usage Note)</label>
                                    <textarea v-model="form.usageNote" class="form-control" rows="2" placeholder="Thường dùng với động từ 'make', 'seize' ..."></textarea>
                                </div>
                                <div class="mb-3">
                                    <label class="form-label text-muted small fw-bold">Collocation (Cụm từ đi kèm)</label>
                                    <input v-model="form.collocation" class="form-control" placeholder="miss an opportunity, golden opportunity" />
                                </div>
                            </div>

                            <!-- Tab 3: Media & Metadata (Updated with Checkboxes) -->
                            <div class="tab-pane fade" id="media" role="tabpanel" aria-labelledby="media-tab">
                                <div class="mb-3">
                                    <label class="form-label text-muted small fw-bold">Hình Ảnh (URL)</label>
                                    <input v-model="form.imageUrl" class="form-control" placeholder="https://example.com/image.jpg" />
                                    <div v-if="form.imageUrl" class="mt-2">
                                        <img :src="form.imageUrl" class="img-thumbnail" style="height: 80px;" alt="Preview">
                                    </div>
                                </div>
                                <div class="mb-3">
                                    <label class="form-label text-muted small fw-bold">Âm Thanh (URL / MP3)</label>
                                    <input v-model="form.audioUrl" class="form-control" placeholder="https://example.com/audio.mp3" />
                                </div>
                                <div class="mb-3">
                                    <label class="form-label text-muted small fw-bold mb-2">Tags (Chọn nhiều)</label>
                                    <div class="card p-2 bg-light" style="max-height: 150px; overflow-y: auto;">
                                        <div v-for="tag in allTags" :key="tag.id" class="form-check">
                                            <input class="form-check-input" type="checkbox" :value="tag.id" :id="'tag-'+tag.id" v-model="selectedTagIds">
                                            <label class="form-check-label w-100" :for="'tag-'+tag.id">
                                                <span class="badge" :class="getTagColor(tag.id)">{{ tag.name }}</span>
                                                <!-- <small class="text-muted" v-if="tag.note"> {{ tag.note }}</small> -->
                                            </label>
                                        </div>
                                        <div v-if="allTags.length === 0" class="text-muted small text-center my-2">
                                            Chưa có tag nào. Vui lòng tạo tag ở màn hình chính.
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="modal-footer border-top-0 px-0 pb-0 mt-3">
                            <button type="button" class="btn btn-light text-muted" data-bs-dismiss="modal">Hủy</button>
                            <button type="submit" class="btn btn-primary px-4">{{ isEditing ? 'Cập Nhật' : 'Lưu Từ Mới' }}</button>
                        </div>
                    </form>
                </div>
            </div>
            </div>
        </div>
        </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import { Modal, Tab } from 'bootstrap';
import axios from 'axios';
import CommonSearch from '../../components/common/CommonSearch.vue';
import CommonPagination from '../../components/common/CommonPagination.vue';

interface Vocabulary {
    id?: number;
    word: string;
    ipa: string;
    meaning: string;
    type: string;
    level: string;
    example: string;
    exampleMeaning: string;
    audioUrl: string;
    imageUrl: string;
    usageNote: string;
    collocation: string;
    tags: Tag[]; // Now array of objects
    popularity: number;
}

const words = ref<Vocabulary[]>([]);
const totalWords = ref(0);
const currentPage = ref(1);
const limit = ref(10);
const totalPages = ref(1);

const searchQuery = ref('');
const selectedType = ref('');
const selectedLevel = ref('');
const loading = ref(false);

const isEditing = ref(false);
const creationMode = ref<'SELECT' | 'MANUAL' | 'TEMPLATE'>('SELECT'); // NEW: Mode Selection
const form = ref<Vocabulary>({
    word: '', ipa: '', meaning: '', type: 'n', level: 'A1', 
    example: '', exampleMeaning: '', audioUrl: '', imageUrl: '', 
    usageNote: '', collocation: '', tags: [], popularity: 0
});

const modalElement = ref<HTMLElement | null>(null);
let modalInstance: Modal | null = null;

// API URL
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

interface Tag {
    id?: number;
    name: string;
    note?: string;
}

const allTags = ref<Tag[]>([]);
const tagForm = ref<Tag>({ name: '', note: '' });

import { useAuthStore } from '../../stores/auth';
import { useToastStore } from '../../stores/toast';

const authStore = useAuthStore();
const toastStore = useToastStore();

// Tag Colors
const tagColors = [
    'bg-primary-subtle text-primary-emphasis border-primary-subtle',
    'bg-success-subtle text-success-emphasis border-success-subtle',
    'bg-danger-subtle text-danger-emphasis border-danger-subtle',
    'bg-warning-subtle text-warning-emphasis border-warning-subtle',
    'bg-info-subtle text-info-emphasis border-info-subtle',
    'bg-dark-subtle text-dark-emphasis border-dark-subtle',
    'bg-secondary-subtle text-secondary-emphasis border-secondary-subtle'
];

const getTagColor = (id?: number) => {
    if (!id) return tagColors[6];
    return tagColors[id % tagColors.length];
};

// ...

// Fetch method for tags
const fetchTags = async () => {
    try {
        const response = await axios.get(`${API_URL}/tags`, {
             headers: { Authorization: `Bearer ${authStore.token}` }
        });
        allTags.value = response.data;
    } catch (e) {
        console.error("Failed to fetch tags", e);
    }
};

const saveTag = async () => {
    if(!tagForm.value.name) {
        toastStore.warning("Vui lòng nhập tên Tag");
        return;
    }
    if (!authStore.token) {
        toastStore.error("Phiên đăng nhập không hợp lệ. Vui lòng F5 hoặc đăng nhập lại.");
        return;
    }

    try {
        console.log("Saving tag with token:", authStore.token);
        await axios.post(`${API_URL}/tags`, tagForm.value, {
             headers: { Authorization: `Bearer ${authStore.token}` }
        });
        tagForm.value = { name: '', note: '' };
        toastStore.success("Thêm tag thành công");
        await fetchTags();
    } catch (e: any) {
         console.error("Save Tag Error:", e);
         if (e.response && e.response.status === 409) {
             toastStore.error("Tag này đã tồn tại!");
         } else if (e.response && e.response.status === 401) {
             toastStore.error("Lỗi xác thực (401). Kiểm tra lại token.");
         } else {
             const msg = e.response?.data?.message || "Lỗi khi lưu tag.";
             toastStore.error(Array.isArray(msg) ? msg[0] : msg);
         }
    }
};

const deleteTag = async (id: number) => {
    if(!confirm("Xóa tag này?")) return;
    try {
        await axios.delete(`${API_URL}/tags/${id}`, {
             headers: { Authorization: `Bearer ${authStore.token}` }
        });
        toastStore.success("Đã xóa tag");
        await fetchTags();
    } catch (e) {
         toastStore.error("Không thể xóa tag này");
    }
};


const fetchWords = async () => {
    loading.value = true;
    try {
        const response = await axios.get(`${API_URL}/vocabularies`, {
            params: {
                page: currentPage.value,
                limit: limit.value,
                search: searchQuery.value,
                type: selectedType.value,
                level: selectedLevel.value
            },
            headers: { Authorization: `Bearer ${authStore.token}` }
        });
        
        words.value = response.data.data;
        totalWords.value = response.data.total;
        totalPages.value = response.data.totalPages;
    } catch (error) {
        console.error("Failed to fetch words:", error);
        toastStore.error("Lỗi tải danh sách từ vựng");
    } finally {
        loading.value = false;
    }
};

const onPageChange = (page: number) => {
    currentPage.value = page;
    fetchWords();
};

watch([selectedType, selectedLevel], () => {
    currentPage.value = 1;
    fetchWords();
});

const resetTabs = () => {
    const firstTabBtn = document.querySelector('#vocabTabs button[data-bs-target="#general"]');
    if (firstTabBtn) {
        const tab = new Tab(firstTabBtn);
        tab.show();
    }
};

const selectedTagIds = ref<number[]>([]);

const openModal = () => {
    isEditing.value = false;
    creationMode.value = 'SELECT';
    form.value = {
        word: '', ipa: '', meaning: '', type: 'n', level: 'A1', 
        example: '', exampleMeaning: '', audioUrl: '', imageUrl: '', 
        usageNote: '', collocation: '', tags: [], popularity: 0
    };
    selectedTagIds.value = []; // Reset selection
    
    if (modalElement.value) {
        // resetTabs(); // No tabs in SELECT mode
        modalInstance = Modal.getOrCreateInstance(modalElement.value);
        modalInstance.show();
    }
};

const editWord = (word: Vocabulary) => {
    isEditing.value = true;
    creationMode.value = 'MANUAL';
    form.value = { ...word }; 
    // Map existing tags objects to their IDs for the checkbox group
    selectedTagIds.value = (word.tags || []).map(t => t.id!);
    
    if (modalElement.value) {
        setTimeout(() => resetTabs(), 0);
        modalInstance = Modal.getOrCreateInstance(modalElement.value);
        modalInstance.show();
    }
};

const saveWord = async () => {
    // Map IDs back to objects for backend
    form.value.tags = selectedTagIds.value.map(id => ({ id } as any));

    try {
        if (isEditing.value && form.value.id) {
            await axios.patch(`${API_URL}/vocabularies/${form.value.id}`, form.value, {
                 headers: { Authorization: `Bearer ${authStore.token}` }
            });
            toastStore.success("Cập nhật từ vựng thành công");
        } else {
            await axios.post(`${API_URL}/vocabularies`, form.value, {
                 headers: { Authorization: `Bearer ${authStore.token}` }
            });
            toastStore.success("Thêm từ mới thành công");
        }
        if (modalInstance) modalInstance.hide();
        fetchWords();
    } catch (error) {
        console.error("Failed to save word:", error);
        toastStore.error("Lỗi khi lưu từ. Vui lòng kiểm tra lại.");
    }
};

const deleteWord = async (id: number) => {
    if (!confirm('Bạn có chắc muốn xóa từ này không?')) return;
    try {
        await axios.delete(`${API_URL}/vocabularies/${id}`, {
             headers: { Authorization: `Bearer ${authStore.token}` }
        });
        toastStore.success("Đã xóa từ vựng");
        fetchWords();
    } catch (error) {
         console.error("Failed to delete word:", error);
         toastStore.error("Không thể xóa từ này");
    }
};

// Helper for Styles
const getTypeBadgeClass = (type: string) => {
    switch (type) {
        case 'n': return 'bg-primary-subtle text-primary border-primary-subtle';
        case 'v': return 'bg-success-subtle text-success border-success-subtle';
        case 'adj': return 'bg-warning-subtle text-warning-emphasis border-warning-subtle';
        case 'adv': return 'bg-info-subtle text-info-emphasis border-info-subtle';
        default: return 'bg-secondary-subtle text-secondary';
    }
};

const getTypeLabel = (type: string) => {
     const map: Record<string, string> = {
        'n': 'Danh từ (n)',
        'v': 'Động từ (v)',
        'adj': 'Tính từ (adj)',
        'adv': 'Trạng từ (adv)'
    };
    return map[type] || type;
};

const getLevelBadgeClass = (level: string) => {
    switch (level) {
        case 'A1': return 'bg-success text-white';
        case 'A2': return 'bg-info text-dark';
        case 'B1': return 'bg-primary text-white';
        case 'B2': return 'bg-warning text-dark';
        case 'C1': return 'bg-danger text-white';
        default: return 'bg-secondary text-white';
    }
};

onMounted(() => {
    fetchWords();
    fetchTags();
});
</script>

<style scoped>
.nav-tabs .nav-link {
    color: #6c757d;
    border: none;
    border-bottom: 2px solid transparent;
}
.nav-tabs .nav-link.active {
    color: #0d6efd;
    border-bottom: 2px solid #0d6efd;
    background: transparent;
}
.nav-tabs .nav-link:hover {
    color: #0d6efd;
}
</style>
