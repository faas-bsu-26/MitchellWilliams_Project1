<script setup>
import { ref, inject } from "vue";
import { store } from "../store.js";

function toggleLike(p) {
  store.toggleLike(store.communityProjects, p.id);
}

const playingId = ref(null);
let currentAudio = null;
function togglePlay(p) {
  if (!p.audioUrl) return;
  if (playingId.value === p.id) {
    currentAudio.pause();
    playingId.value = null;
    return;
  }
  if (currentAudio) currentAudio.pause();
  playingId.value = p.id;
  currentAudio = new Audio(p.audioUrl);
  currentAudio.play();
  currentAudio.onended = () => {
    playingId.value = null;
  };
}

const showAddProject = inject("showAddProject");
const form = ref({ title: "", description: "", tags: "" });
const projectFileName = ref(null);
const projectAudioUrl = ref(null);
const coverPreview = ref(null);
const sourceSounds = ref([]);
const posted = ref(false);

function onProjectFileUpload(e) {
  const file = e.target.files[0];
  if (!file) return;
  projectFileName.value = file.name;
  if (file.type.startsWith("audio/"))
    projectAudioUrl.value = URL.createObjectURL(file);
}
function onCoverUpload(e) {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (ev) => {
    coverPreview.value = ev.target.result;
  };
  reader.readAsDataURL(file);
}
function addSourceSlot() {
  sourceSounds.value.push({
    id: Date.now(),
    label: "",
    fileName: null,
    audioUrl: null,
  });
}
function onSourceUpload(e, source) {
  const file = e.target.files[0];
  if (!file) return;
  source.fileName = file.name;
  if (file.type.startsWith("audio/"))
    source.audioUrl = URL.createObjectURL(file);
}
function removeSource(id) {
  sourceSounds.value = sourceSounds.value.filter((s) => s.id !== id);
}
function submitProject() {
  if (!form.value.title.trim()) return;
  posted.value = true;
  store.addProject({
    title: form.value.title,
    description: form.value.description,
    tags: form.value.tags
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean),
    audioUrl: projectAudioUrl.value,
    photoPreview: coverPreview.value,
    sourceSounds: sourceSounds.value.map((s) => ({
      label: s.label,
      fileName: s.fileName,
      audioUrl: s.audioUrl,
    })),
  });
  setTimeout(() => {
    form.value = { title: "", description: "", tags: "" };
    projectFileName.value = null;
    projectAudioUrl.value = null;
    coverPreview.value = null;
    sourceSounds.value = [];
    posted.value = false;
    showAddProject.value = false;
  }, 1000);
}
</script>

<template>
  <div>
    <div v-if="!showAddProject">
      <div class="header">
        <h2>COMMUNITY</h2>
        <i class="pi pi-filter" />
      </div>

      <div v-for="p in store.communityProjects" :key="p.id" class="card">
        <div class="card-image">
          <img
            v-if="p.photoPreview"
            :src="p.photoPreview"
            class="card-img"
            alt=""
          />
          <i v-else class="pi pi-folder-open" />
        </div>
        <div class="card-body">
          <div class="author-row">
            <div class="avatar">{{ p.author?.[0] }}</div>
            <span class="author-name">{{ p.author }}</span>
          </div>
          <h4>{{ p.title }}</h4>
          <p class="desc">{{ p.description }}</p>
          <div v-if="p.audioUrl" class="audio-bar">
            <button class="play-btn" @click="togglePlay(p)">
              <i
                :class="
                  playingId === p.id
                    ? 'pi pi-pause-circle'
                    : 'pi pi-play-circle'
                "
              />
            </button>
            <div class="waveform">
              <div
                v-for="i in 22"
                :key="i"
                class="bar"
                :class="{ active: playingId === p.id }"
                :style="{ animationDelay: `${i * 0.04}s` }"
              />
            </div>
            <button class="icon-btn" title="Download">
              <i class="pi pi-download" />
            </button>
            <button class="icon-btn" title="Save">
              <i class="pi pi-bookmark" />
            </button>
          </div>
          <div v-if="p.sourceSounds?.length" class="sources">
            <p class="sources-label">Source sounds</p>
            <div v-for="(s, i) in p.sourceSounds" :key="i" class="source-item">
              <i class="pi pi-file-audio" style="color: #4ade80" />
              <span>{{ s.label || s.fileName || `Source ${i + 1}` }}</span>
            </div>
          </div>
          <div class="card-footer">
            <div class="tags">
              <span v-for="tag in p.tags" :key="tag" class="tag">{{
                tag
              }}</span>
            </div>
            <div class="actions">
              <button
                class="action-btn"
                :class="{ liked: p.liked }"
                @click="toggleLike(p)"
              >
                <i :class="p.liked ? 'pi pi-heart-fill' : 'pi pi-heart'" />
                {{ p.likes }}
              </button>
              <button class="action-btn">
                <i class="pi pi-comment" /> {{ p.comments }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="add-form">
      <div class="add-header">
        <button class="back-btn" @click="showAddProject = false">
          <i class="pi pi-arrow-left" />
        </button>
        <h2>New Project</h2>
        <div style="width: 32px" />
      </div>

      <label class="cover-upload">
        <img v-if="coverPreview" :src="coverPreview" class="cover-img" alt="" />
        <div v-else class="cover-placeholder">
          <i class="pi pi-image" /><span>Add Cover Image</span>
        </div>
        <input type="file" accept="image/*" hidden @change="onCoverUpload" />
      </label>

      <div class="fields">
        <input v-model="form.title" placeholder="Project Title" class="field" />
        <textarea
          v-model="form.description"
          placeholder="Description"
          class="field textarea"
        />
        <input
          v-model="form.tags"
          placeholder="Tags (comma separated)"
          class="field"
        />
      </div>

      <div class="section">
        <p class="section-label">Project File</p>
        <label class="upload-row">
          <i class="pi pi-upload" />
          <span>{{ projectFileName || "Attach audio or video file" }}</span>
          <input
            type="file"
            accept="audio/*,video/*"
            hidden
            @change="onProjectFileUpload"
          />
        </label>
        <audio
          v-if="projectAudioUrl"
          :src="projectAudioUrl"
          controls
          class="audio-player"
        />
      </div>

      <div class="section">
        <div class="section-header">
          <p class="section-label">Source Sounds</p>
          <button class="add-source-btn" @click="addSourceSlot">
            <i class="pi pi-plus" /> Add
          </button>
        </div>
        <p class="section-hint">
          List the original field recordings used to create this project.
        </p>
        <div v-for="source in sourceSounds" :key="source.id" class="source-row">
          <div class="source-row-top">
            <input
              v-model="source.label"
              placeholder="Label (e.g. Rain ambience)"
              class="field"
            />
            <button class="remove-btn" @click="removeSource(source.id)">
              <i class="pi pi-times" />
            </button>
          </div>
          <label class="upload-row">
            <i class="pi pi-file-audio" />
            <span>{{ source.fileName || "Attach source file" }}</span>
            <input
              type="file"
              accept="audio/*"
              hidden
              @change="(e) => onSourceUpload(e, source)"
            />
          </label>
          <audio
            v-if="source.audioUrl"
            :src="source.audioUrl"
            controls
            class="audio-player"
          />
        </div>
        <p v-if="sourceSounds.length === 0" class="sources-empty">
          No source sounds added yet
        </p>
      </div>

      <button
        class="post-btn"
        :class="{ success: posted }"
        @click="submitProject"
      >
        <i :class="posted ? 'pi pi-check' : 'pi pi-send'" />
        {{ posted ? "Posted!" : "Post Project" }}
      </button>
    </div>
  </div>
</template>

<style scoped>
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}
.header h2 {
  margin: 0;
  font-size: 1.1rem;
  letter-spacing: 2px;
  text-decoration: underline;
}

.card {
  background: #2a2a2a;
  border-radius: 12px;
  overflow: hidden;
  margin-bottom: 1rem;
}
.card-image {
  position: relative;
  height: 120px;
  background: linear-gradient(135deg, #1e2d1e, #0f1f0f);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2.5rem;
  color: #4ade80;
}
.card-img {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.card-body {
  padding: 0.9rem;
}
.author-row {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
}
.avatar {
  width: 26px;
  height: 26px;
  border-radius: 50%;
  background: linear-gradient(135deg, #4ade80, #16a34a);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.7rem;
  font-weight: 700;
  color: #0f1f0f;
  flex-shrink: 0;
}
.author-name {
  font-size: 0.8rem;
  font-weight: 600;
}
.card-body h4 {
  margin: 0 0 4px;
  font-size: 1rem;
}
.desc {
  margin: 0 0 10px;
  font-size: 0.85rem;
  color: #bbb;
  line-height: 1.4;
}

.audio-bar {
  display: flex;
  align-items: center;
  gap: 8px;
  background: #1e1e1e;
  border-radius: 8px;
  padding: 6px 10px;
  margin-bottom: 10px;
}
.play-btn {
  background: none;
  border: none;
  color: #6366f1;
  font-size: 1.4rem;
  padding: 0;
  cursor: pointer;
}
.play-btn:hover {
  color: #818cf8;
}
.waveform {
  display: flex;
  align-items: center;
  gap: 2px;
  flex: 1;
}
.bar {
  width: 3px;
  height: 8px;
  background: #444;
  border-radius: 2px;
}
.bar.active {
  background: #6366f1;
  animation: wp 0.5s ease-in-out infinite alternate;
}
@keyframes wp {
  from {
    transform: scaleY(0.3);
  }
  to {
    transform: scaleY(1.5);
  }
}
.icon-btn {
  background: none;
  border: none;
  color: #555;
  font-size: 0.95rem;
  padding: 4px;
  border-radius: 6px;
  cursor: pointer;
  transition: color 0.2s;
}
.icon-btn:hover {
  color: #aaa;
}

.sources {
  margin-bottom: 10px;
}
.sources-label {
  margin: 0 0 5px;
  font-size: 0.75rem;
  color: #666;
  text-transform: uppercase;
  letter-spacing: 0.8px;
}
.source-item {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 5px 0;
  border-bottom: 1px solid #333;
  font-size: 0.8rem;
  color: #aaa;
}

.card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.tags {
  display: flex;
  gap: 5px;
  flex-wrap: wrap;
}
.tag {
  background: #1e2d1e;
  border: 1px solid #3a5a3a;
  border-radius: 4px;
  padding: 2px 7px;
  font-size: 0.7rem;
  text-transform: capitalize;
  color: #4ade80;
}
.actions {
  display: flex;
  gap: 10px;
}
.action-btn {
  display: flex;
  align-items: center;
  gap: 4px;
  background: none;
  border: none;
  color: #aaa;
  font-size: 0.85rem;
  padding: 0;
  cursor: pointer;
  transition: color 0.2s;
}
.action-btn:hover {
  color: white;
}
.action-btn.liked {
  color: #e05555;
}

.add-form {
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
}
.add-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.add-header h2 {
  margin: 0;
  font-size: 1.1rem;
}
.back-btn {
  width: 32px;
  background: none;
  border: none;
  color: #aaa;
  font-size: 1.1rem;
  padding: 0;
  cursor: pointer;
}
.back-btn:hover {
  color: white;
}

.cover-upload {
  display: block;
  cursor: pointer;
}
.cover-placeholder {
  height: 160px;
  background: #2a2a2a;
  border: 1px dashed #444;
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  color: #555;
  font-size: 0.9rem;
  transition: border-color 0.2s;
}
.cover-placeholder .pi {
  font-size: 2rem;
}
.cover-placeholder:hover {
  border-color: #6366f1;
  color: #aaa;
}
.cover-img {
  display: block;
  width: 100%;
  height: 160px;
  object-fit: cover;
  border-radius: 12px;
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
.textarea {
  min-height: 80px;
  resize: none;
  font-family: inherit;
}

.section {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.section-label {
  margin: 0;
  font-size: 0.78rem;
  color: #666;
  text-transform: uppercase;
  letter-spacing: 0.8px;
}
.section-hint {
  margin: 0;
  font-size: 0.78rem;
  color: #555;
}
.add-source-btn {
  display: flex;
  align-items: center;
  gap: 5px;
  background: #2a2a2a;
  border: 1px solid #444;
  border-radius: 6px;
  color: #aaa;
  font-size: 0.8rem;
  padding: 5px 10px;
  cursor: pointer;
}
.add-source-btn:hover {
  border-color: #6366f1;
  color: white;
}

.upload-row {
  display: flex;
  align-items: center;
  gap: 10px;
  background: #2a2a2a;
  border: 1px solid #444;
  border-radius: 10px;
  padding: 11px 14px;
  color: #aaa;
  font-size: 0.88rem;
  cursor: pointer;
  transition: border-color 0.2s;
}
.upload-row:hover {
  border-color: #6366f1;
  color: white;
}
.upload-row .pi {
  color: #6366f1;
}
.audio-player {
  width: 100%;
  border-radius: 8px;
}

.source-row {
  display: flex;
  flex-direction: column;
  gap: 8px;
  background: #222;
  border-radius: 10px;
  padding: 10px;
}
.source-row-top {
  display: flex;
  align-items: center;
  gap: 8px;
}
.remove-btn {
  background: none;
  border: none;
  color: #555;
  font-size: 0.9rem;
  padding: 4px;
  flex-shrink: 0;
  cursor: pointer;
}
.remove-btn:hover {
  color: #e05555;
}
.sources-empty {
  text-align: center;
  color: #444;
  font-size: 0.85rem;
  padding: 12px 0;
}

.post-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: 100%;
  padding: 13px;
  margin-bottom: 1rem;
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
