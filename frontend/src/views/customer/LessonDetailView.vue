<template>
  <div v-if="lesson">
    <div class="d-flex align-items-center mb-4">
      <router-link to="/lessons" class="btn btn-light rounded-circle me-3" style="width: 40px; height: 40px; display: flex; align-items: center; justify-content: center;">
        <i class="fas fa-arrow-left"></i>
      </router-link>
      <div>
        <h2 class="fw-bold m-0">{{ lesson.title }}</h2>
        <small class="text-muted">{{ lesson.difficultyLevel }} • {{ lesson.duration }} giây</small>
      </div>
    </div>

    <div class="row g-4">
      <!-- Audio Player Section -->
      <div class="col-lg-12">
        <div class="card border-0 shadow-sm mb-4 bg-primary text-white">
          <div class="card-body p-4 d-flex align-items-center justify-content-center flex-column">
             <div class="mb-3">
               <i class="fas fa-headphones-alt fa-3x"></i>
             </div>
             <!-- Standard Audio Player -->
             <audio ref="audioPlayer" controls class="w-100" style="max-width: 600px;">
               <source :src="lesson.audioUrl" type="audio/mpeg">
               Trình duyệt của bạn không hỗ trợ thẻ audio.
             </audio>
             <div class="mt-2 small opacity-75">Nghe và chép lại những gì bạn nghe được vào ô bên dưới.</div>
          </div>
        </div>
      </div>

      <!-- Typing Area -->
      <div class="col-lg-6">
        <div class="card border-0 shadow-sm h-100">
           <div class="card-header bg-white fw-bold py-3">
             <i class="fas fa-keyboard me-2 text-primary"></i> Nhập văn bản
           </div>
           <div class="card-body p-0">
             <textarea 
               v-model="userInput" 
               class="form-control border-0 h-100 p-3" 
               style="resize: none; min-height: 300px; font-size: 1.1rem; line-height: 1.6;"
               placeholder="Bắt đầu gõ ở đây..."
               :disabled="checked"
             ></textarea>
           </div>
           <div class="card-footer bg-white border-top-0 p-3">
             <button v-if="!checked" @click="checkResult" class="btn btn-primary w-100 py-2 rounded-pill fw-bold">
               <i class="fas fa-check-circle me-2"></i> Kiểm Tra
             </button>
             <button v-else @click="retry" class="btn btn-outline-secondary w-100 py-2 rounded-pill fw-bold">
               <i class="fas fa-redo me-2"></i> Thử Lại
             </button>
           </div>
        </div>
      </div>

      <!-- Result/Diff Area -->
      <div class="col-lg-6">
        <div class="card border-0 shadow-sm h-100" :class="{'opacity-50': !checked}">
           <div class="card-header bg-white fw-bold py-3">
             <i class="fas fa-poll-h me-2 text-success"></i> Kết quả
           </div>
           <div class="card-body p-3 overflow-auto" style="max-height: 400px; min-height: 300px; font-size: 1.1rem; line-height: 1.6;">
             <div v-if="!checked" class="text-center text-muted h-100 d-flex flex-column justify-content-center align-items-center">
               <i class="fas fa-eye-slash fa-2x mb-3 opacity-25"></i>
               <p>Kết quả sẽ hiện ở đây sau khi bạn nộp bài.</p>
             </div>
             <div v-else>
               <div class="mb-3">
                 <span class="badge bg-success me-2">Độ chính xác: {{ accuracy }}%</span>
                 <span class="badge bg-danger">{{ errorCount }} lỗi</span>
               </div>
               <div class="result-content bg-light p-3 rounded" v-html="diffHtml"></div>
             </div>
           </div>
        </div>
      </div>
    </div>

  </div>
  <div v-else class="text-center py-5">
      <div class="spinner-border text-primary" role="status"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import axios from 'axios';
import { useAuthStore } from '../../stores/auth';
import * as Diff from 'diff';

const route = useRoute();
const authStore = useAuthStore();
const lesson = ref<any>(null);
const userInput = ref('');
const checked = ref(false);
const diffHtml = ref('');
const accuracy = ref(0);
const errorCount = ref(0);

const fetchLesson = async () => {
  try {
    const response = await axios.get(`http://localhost:3000/lessons/${route.params.id}`, {
      headers: { Authorization: `Bearer ${authStore.token}` }
    });
    lesson.value = response.data;
  } catch (error) {
    console.error('Lỗi tải bài học:', error);
  }
};

const checkResult = () => {
  if (!lesson.value) return;
  
  checked.value = true;
  const original = lesson.value.content.trim(); // Assuming 'content' is the transcript
  const current = userInput.value.trim();

  const diff = Diff.diffWords(original, current);
  let html = '';
  let errors = 0;
  let correctChars = 0; // Rough estimation logic or use Levenshtein for better %. 
  // Let's settle for simple word counting for MVP accuracy.

  diff.forEach((part) => {
    // Logic:
    // Added = User typed extra/wrong words (Red)
    // Removed = In Transcript but missing in User Input (Green)
    
    if (part.added) {
        html += `<span class="text-danger text-decoration-line-through mx-1">${part.value}</span>`;
        errors += part.value.split(/\s+/).length;
    } else if (part.removed) {
        html += `<span class="text-success fw-bold mx-1">${part.value}</span>`;
        errors += part.value.split(/\s+/).length;
    } else {
        html += `<span class="text-dark mx-1">${part.value}</span>`;
        correctChars += part.value.length;
    }
  });

  diffHtml.value = html;
  errorCount.value = errors;
  
  // Simple accuracy: (1 - errors / total_words_in_transcript). 
  // This is rough but okay for MVP.
  const totalWords = original.split(/\s+/).length;
  accuracy.value = Math.max(0, Math.round(((totalWords - errors) / totalWords) * 100));
};

const retry = () => {
  checked.value = false;
  userInput.value = '';
  diffHtml.value = '';
};

onMounted(fetchLesson);
</script>
