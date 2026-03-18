<script setup>
import { ref, computed, onUnmounted } from "vue";
import { useRouter } from "vue-router";
import { store } from "../store.js";

const router = useRouter();
const step = ref(1);

const isRecording = ref(false);
const seconds = ref(0);
const audioName = ref(null);
const audioUrl = ref(null);
let timer = null;

const formattedTime = computed(() => {
  const m = Math.floor(seconds.value / 60)
    .toString()
    .padStart(2, "0");
  const s = (seconds.value % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
});

function toggleRecording() {
  if (isRecording.value) {
    clearInterval(timer);
    isRecording.value = false;
  } else {
    seconds.value = 0;
    isRecording.value = true;
    timer = setInterval(() => seconds.value++, 1000);
  }
}

function onAudioUpload(e) {
  const file = e.target.files[0];
  if (!file) return;
  audioName.value = file.name;
  audioUrl.value = URL.createObjectURL(file);
}

onUnmounted(() => clearInterval(timer));

const photoPreview = ref(null);
function onPhotoUpload(e) {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (ev) => {
    photoPreview.value = ev.target.result;
  };
  reader.readAsDataURL(file);
}

const form = ref({ title: "", location: "", info: "", tags: "" });
const posted = ref(false);
function submitPost() {
  if (!form.value.title.trim()) return;
  posted.value = true;
  store.addPost({
    title: form.value.title,
    location: form.value.location,
    description: form.value.info,
    tags: form.value.tags
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean),
    audioUrl: audioUrl.value,
    photoPreview: photoPreview.value,
  });
  setTimeout(() => {
    step.value = 1;
    seconds.value = 0;
    audioName.value = null;
    audioUrl.value = null;
    photoPreview.value = null;
    form.value = { title: "", location: "", info: "", tags: "" };
    posted.value = false;
    router.push("/profile");
  }, 1200);
}
</script>

<template>
  <div class="page">
    <div class="steps">
      <button
        v-for="n in 3"
        :key="n"
        class="step-dot"
        :class="{ active: step === n, done: step > n }"
        @click="step = n"
      >
        <i v-if="step > n" class="pi pi-check" /><span v-else>{{ n }}</span>
      </button>
    </div>

    <div v-if="step === 1">
      <label class="upload-btn">
        <i class="pi pi-upload" /> Upload Audio File
        <input type="file" accept="audio/*" hidden @change="onAudioUpload" />
      </label>
      <p v-if="audioName" class="file-name">
        <i class="pi pi-file-audio" /> {{ audioName }}
      </p>
      <audio v-if="audioUrl" :src="audioUrl" controls class="audio-player" />
      <div class="waveform" :class="{ recording: isRecording }">
        <div
          v-for="i in 30"
          :key="i"
          class="bar"
          :style="{ animationDelay: `${i * 0.05}s` }"
        />
      </div>
      <p class="time">{{ formattedTime }}</p>
      <div class="row-between">
        <button
          class="record-btn"
          :class="{ active: isRecording }"
          @click="toggleRecording"
        >
          <i :class="isRecording ? 'pi pi-stop-circle' : 'pi pi-circle-fill'" />
          {{ isRecording ? "Stop" : "Record" }}
        </button>
        <button class="next-btn" @click="step++">
          Next <i class="pi pi-arrow-right" />
        </button>
      </div>
    </div>

    <div v-if="step === 2">
      <label class="upload-btn">
        <i class="pi pi-upload" /> Upload Photo
        <input type="file" accept="image/*" hidden @change="onPhotoUpload" />
      </label>
      <div class="photo-preview">
        <img
          v-if="photoPreview"
          :src="photoPreview"
          class="preview-img"
          alt=""
        />
        <i v-else class="pi pi-image" />
      </div>
      <div class="row-between">
        <label class="icon-btn"
          ><i class="pi pi-camera" /><input
            type="file"
            accept="image/*"
            hidden
            @change="onPhotoUpload"
        /></label>
        <button class="next-btn" @click="step++">
          Next <i class="pi pi-arrow-right" />
        </button>
      </div>
    </div>

    <div v-if="step === 3">
      <div class="mini-preview">
        <img
          v-if="photoPreview"
          :src="photoPreview"
          class="preview-img"
          alt=""
        />
        <i v-else class="pi pi-image" />
      </div>
      <div class="fields">
        <input v-model="form.title" placeholder="Title" class="field" />
        <input v-model="form.location" placeholder="Location" class="field" />
        <input
          v-model="form.info"
          placeholder="Info / Description"
          class="field"
        />
        <input
          v-model="form.tags"
          placeholder="Tags (comma separated)"
          class="field"
        />
      </div>
      <button class="post-btn" :class="{ success: posted }" @click="submitPost">
        <i :class="posted ? 'pi pi-check' : 'pi pi-send'" />
        {{ posted ? "Posted!" : "Post" }}
      </button>
    </div>
  </div>
</template>

<style scoped>
.page {
  padding: 1rem;
}

.steps {
  display: flex;
  justify-content: center;
  gap: 12px;
  margin-bottom: 2rem;
}
.step-dot {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: 2px solid #444;
  background: transparent;
  color: #888;
  font-size: 0.85rem;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
}
.step-dot.active {
  border-color: #6366f1;
  background: #6366f1;
  color: white;
}
.step-dot.done {
  border-color: #4ade80;
  color: #4ade80;
}

.upload-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: 100%;
  padding: 12px;
  background: #2a2a2a;
  border: 1px solid #444;
  border-radius: 10px;
  color: #ccc;
  font-size: 0.9rem;
  cursor: pointer;
  transition: border-color 0.2s;
}
.upload-btn:hover {
  border-color: #6366f1;
  color: white;
}
.file-name {
  margin: 6px 0 0;
  font-size: 0.8rem;
  color: #888;
  text-align: center;
}
.audio-player {
  width: 100%;
  margin-top: 0.75rem;
  border-radius: 8px;
}

.waveform {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 3px;
  height: 70px;
  background: #1e1e1e;
  border-radius: 10px;
  margin: 1rem 0 0.5rem;
  overflow: hidden;
}
.bar {
  width: 3px;
  height: 8px;
  background: #444;
  border-radius: 2px;
}
.waveform.recording .bar {
  background: #6366f1;
  animation: pulse 0.6s ease-in-out infinite alternate;
}
@keyframes pulse {
  from {
    height: 4px;
  }
  to {
    height: 32px;
  }
}
.time {
  margin: 0;
  text-align: center;
  font-size: 1.1rem;
  font-variant-numeric: tabular-nums;
}

.photo-preview {
  height: 200px;
  background: #2a2a2a;
  border-radius: 12px;
  margin-top: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 3rem;
  color: #555;
  overflow: hidden;
}
.mini-preview {
  height: 120px;
  background: #2a2a2a;
  border-radius: 10px;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  color: #555;
  overflow: hidden;
}
.preview-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.fields {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.field {
  width: 100%;
  background: #2a2a2a;
  border: 1px solid #444;
  border-radius: 8px;
  color: white;
  padding: 10px 12px;
  font-size: 0.9rem;
  outline: none;
}
.field:focus {
  border-color: #6366f1;
}

.row-between {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 1.5rem;
}
.record-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 10px 16px;
  background: #2a2a2a;
  border: 1px solid #444;
  border-radius: 8px;
  color: white;
  font-size: 0.9rem;
  cursor: pointer;
  transition: border-color 0.2s;
}
.record-btn.active {
  border-color: #e05555;
  color: #e05555;
}
.record-btn:hover {
  border-color: #6366f1;
}
.next-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 10px 18px;
  background: #6366f1;
  border: none;
  border-radius: 8px;
  color: white;
  font-weight: 600;
  cursor: pointer;
}
.next-btn:hover {
  background: #4f46e5;
}
.icon-btn {
  width: 42px;
  height: 42px;
  background: #2a2a2a;
  border: 1px solid #444;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ccc;
  font-size: 1rem;
  cursor: pointer;
}
.icon-btn:hover {
  border-color: #6366f1;
}

.post-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: 100%;
  margin-top: 1.2rem;
  padding: 12px;
  background: #6366f1;
  border: none;
  border-radius: 10px;
  color: white;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.3s;
}
.post-btn:hover {
  background: #4f46e5;
}
.post-btn.success {
  background: #16a34a;
}
</style>
