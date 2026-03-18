<script setup>
import { ref, computed, inject } from "vue";
import { store } from "../store.js";

const filter = ref("all");
const filters = ["all", "nature", "urban"];
const filtered = computed(() =>
  filter.value === "all"
    ? store.explorePosts
    : store.explorePosts.filter((p) => p.tags.includes(filter.value)),
);

function toggleLike(post) {
  store.toggleLike(store.explorePosts, post.id);
}

const playingId = ref(null);
let currentAudio = null;
function togglePlay(post) {
  if (!post.audioUrl) return;
  if (playingId.value === post.id) {
    currentAudio.pause();
    playingId.value = null;
    return;
  }
  if (currentAudio) currentAudio.pause();
  playingId.value = post.id;
  currentAudio = new Audio(post.audioUrl);
  currentAudio.play();
  currentAudio.onended = () => {
    playingId.value = null;
  };
}

const showAddModal = inject("showAddModal");
const newPost = ref({ title: "", location: "", info: "", tags: "" });
function submitPost() {
  if (!newPost.value.title.trim()) return;
  store.addPost({
    title: newPost.value.title,
    location: newPost.value.location,
    description: newPost.value.info,
    tags: newPost.value.tags
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean),
    audioUrl: null,
    photoPreview: null,
  });
  newPost.value = { title: "", location: "", info: "", tags: "" };
  showAddModal.value = false;
}
</script>

<template>
  <div class="page">
    <div class="header">
      <h2>TRENDING</h2>
      <div class="filter-row">
        <i class="pi pi-filter" />
        <select v-model="filter">
          <option v-for="f in filters" :key="f" :value="f">{{ f }}</option>
        </select>
      </div>
    </div>

    <div v-for="post in filtered" :key="post.id" class="card">
      <div class="card-image">
        <img
          v-if="post.photoPreview"
          :src="post.photoPreview"
          class="card-img"
          alt=""
        />
        <i v-else class="pi pi-headphones" />
        <span class="card-date">{{ post.date }}</span>
        <button
          v-if="post.audioUrl"
          class="play-overlay"
          @click="togglePlay(post)"
        >
          <i :class="playingId === post.id ? 'pi pi-pause' : 'pi pi-play'" />
        </button>
      </div>
      <div class="card-body">
        <div class="author-row">
          <div class="avatar">{{ post.author?.[0] }}</div>
          <span class="author-name">{{ post.author }}</span>
          <span class="muted">{{ post.date }}</span>
        </div>
        <div class="title-row">
          <h4>{{ post.title }}</h4>
          <span class="muted"
            ><i class="pi pi-map-marker" /> {{ post.location }}</span
          >
        </div>
        <p class="desc">{{ post.description }}</p>
        <div v-if="post.audioUrl" class="audio-bar">
          <button class="play-btn" @click="togglePlay(post)">
            <i
              :class="
                playingId === post.id
                  ? 'pi pi-pause-circle'
                  : 'pi pi-play-circle'
              "
            />
          </button>
          <div class="waveform">
            <div
              v-for="i in 24"
              :key="i"
              class="bar"
              :class="{ active: playingId === post.id }"
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
        <div class="card-footer">
          <div class="tags">
            <span v-for="tag in post.tags" :key="tag" class="tag">{{
              tag
            }}</span>
          </div>
          <div class="actions">
            <button
              class="action-btn"
              :class="{ liked: post.liked }"
              @click="toggleLike(post)"
            >
              <i :class="post.liked ? 'pi pi-heart-fill' : 'pi pi-heart'" />
              {{ post.likes }}
            </button>
            <button class="action-btn">
              <i class="pi pi-comment" /> {{ post.comments }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <p v-if="filtered.length === 0" class="empty">
      No posts for "{{ filter }}"
    </p>

    <div
      v-if="showAddModal"
      class="modal-overlay"
      @click.self="showAddModal = false"
    >
      <div class="modal">
        <div class="modal-header">
          <h3>New Post</h3>
          <button class="close-btn" @click="showAddModal = false">
            <i class="pi pi-times" />
          </button>
        </div>
        <div class="modal-body">
          <input v-model="newPost.title" placeholder="Title" class="field" />
          <input
            v-model="newPost.location"
            placeholder="Location"
            class="field"
          />
          <input
            v-model="newPost.info"
            placeholder="Description"
            class="field"
          />
          <input
            v-model="newPost.tags"
            placeholder="Tags (comma separated)"
            class="field"
          />
        </div>
        <div class="modal-footer">
          <button class="cancel-btn" @click="showAddModal = false">
            Cancel
          </button>
          <button class="submit-btn" @click="submitPost">Post</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.page {
  padding: 1rem;
}

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
.filter-row {
  display: flex;
  align-items: center;
  gap: 6px;
  color: #aaa;
}
.filter-row select {
  background: #2a2a2a;
  color: white;
  border: 1px solid #444;
  border-radius: 6px;
  padding: 4px 8px;
  font-size: 0.8rem;
  cursor: pointer;
}

.card {
  background: #2a2a2a;
  border-radius: 12px;
  overflow: hidden;
  margin-bottom: 1rem;
}
.card-image {
  position: relative;
  height: 140px;
  background: linear-gradient(135deg, #2d2d4e, #1a1a2e);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2.5rem;
  color: #6366f1;
}
.card-img {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.card-date {
  position: absolute;
  bottom: 8px;
  right: 10px;
  z-index: 1;
  background: rgba(0, 0, 0, 0.5);
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 0.72rem;
  color: #aaa;
}
.play-overlay {
  position: absolute;
  inset: 0;
  z-index: 2;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.3);
  border: none;
  font-size: 2rem;
  color: white;
  cursor: pointer;
  opacity: 0;
  transition: opacity 0.2s;
}
.card-image:hover .play-overlay {
  opacity: 1;
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
  background: linear-gradient(135deg, #6366f1, #4f46e5);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.7rem;
  font-weight: 700;
  flex-shrink: 0;
}
.author-name {
  font-size: 0.8rem;
  font-weight: 600;
}
.muted {
  font-size: 0.72rem;
  color: #666;
  margin-left: auto;
}
.title-row {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 4px;
}
.title-row h4 {
  margin: 0;
  font-size: 1rem;
}
.title-row .muted {
  margin-left: 8px;
  white-space: nowrap;
}
.desc {
  margin: 4px 0 10px;
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
  cursor: pointer;
  padding: 0;
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
  animation: wave 0.5s ease-in-out infinite alternate;
}
@keyframes wave {
  from {
    transform: scaleY(0.4);
  }
  to {
    transform: scaleY(1.4);
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
  background: #3a3a3a;
  border: 1px solid #555;
  border-radius: 4px;
  padding: 2px 7px;
  font-size: 0.7rem;
  text-transform: capitalize;
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

.empty {
  text-align: center;
  color: #666;
  padding: 2rem;
}

.modal-overlay {
  position: fixed;
  inset: 0;
  z-index: 100;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: flex-end;
  justify-content: center;
}
.modal {
  width: 100%;
  max-width: 420px;
  background: #242424;
  border-radius: 16px 16px 0 0;
  padding: 1.5rem;
}
.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}
.modal-header h3 {
  margin: 0;
}
.close-btn {
  background: none;
  border: none;
  color: #aaa;
  font-size: 1rem;
  cursor: pointer;
}
.modal-body {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 1rem;
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
.modal-footer {
  display: flex;
  gap: 10px;
}
.cancel-btn {
  flex: 1;
  padding: 10px;
  background: #333;
  border: none;
  border-radius: 8px;
  color: white;
  cursor: pointer;
}
.submit-btn {
  flex: 1;
  padding: 10px;
  background: #6366f1;
  border: none;
  border-radius: 8px;
  color: white;
  font-weight: 600;
  cursor: pointer;
}
.submit-btn:hover {
  background: #4f46e5;
}
</style>
