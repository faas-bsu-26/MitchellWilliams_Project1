<script setup>
import { ref, computed } from "vue";
import { store } from "../store.js";

const tab = ref("posts");
const myPosts = computed(() => store.myPosts);
const collections = [
  { id: 1, name: "Nature Sounds", count: 12 },
  { id: 2, name: "City Life", count: 7 },
  { id: 3, name: "Favorites", count: 24 },
  { id: 4, name: "Field Trips", count: 5 },
];

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
</script>

<template>
  <div class="page">
    <div class="profile-header">
      <div class="avatar">M</div>
      <h3>Mitchell Williams</h3>
      <p class="handle">@mwilliams</p>
      <div class="stats">
        <div class="stat">
          <span class="stat-num">{{ myPosts.length }}</span
          ><span class="stat-label">Posts</span>
        </div>
        <div class="divider" />
        <div class="stat">
          <span class="stat-num">{{ collections.length }}</span
          ><span class="stat-label">Collections</span>
        </div>
        <div class="divider" />
        <div class="stat">
          <span class="stat-num">158</span
          ><span class="stat-label">Followers</span>
        </div>
      </div>
    </div>

    <div class="tabs">
      <button
        class="tab-btn"
        :class="{ active: tab === 'posts' }"
        @click="tab = 'posts'"
      >
        Posts
      </button>
      <button
        class="tab-btn"
        :class="{ active: tab === 'collections' }"
        @click="tab = 'collections'"
      >
        Collections
      </button>
    </div>

    <div v-if="tab === 'posts'">
      <div v-if="myPosts.length === 0" class="empty">
        <i class="pi pi-microphone" style="font-size: 2rem; opacity: 0.3" />
        <p>No posts yet. Record something!</p>
      </div>
      <div v-for="post in myPosts" :key="post.id" class="post-item">
        <div class="post-thumb">
          <img
            v-if="post.photoPreview"
            :src="post.photoPreview"
            class="thumb-img"
            alt=""
          />
          <i v-else class="pi pi-headphones" />
        </div>
        <div class="post-info">
          <p class="post-title">{{ post.title }}</p>
          <p v-if="post.location" class="muted">
            <i class="pi pi-map-marker" /> {{ post.location }}
          </p>
          <p v-if="post.description" class="post-desc">
            {{ post.description }}
          </p>
          <div v-if="post.audioUrl" class="audio-row">
            <button class="play-btn" @click="togglePlay(post)">
              <i
                :class="
                  playingId === post.id
                    ? 'pi pi-pause-circle'
                    : 'pi pi-play-circle'
                "
              />
            </button>
            <div class="mini-wave">
              <div
                v-for="i in 18"
                :key="i"
                class="bar"
                :class="{ active: playingId === post.id }"
                :style="{ animationDelay: `${i * 0.05}s` }"
              />
            </div>
          </div>
          <div v-if="post.tags?.length" class="post-tags">
            <span v-for="tag in post.tags" :key="tag" class="tag">{{
              tag
            }}</span>
          </div>
          <p class="muted small">{{ post.date }}</p>
        </div>
      </div>
    </div>

    <div v-if="tab === 'collections'" class="collections-grid">
      <div v-for="col in collections" :key="col.id" class="collection-card">
        <div class="col-images">
          <i v-for="j in 4" :key="j" class="pi pi-image" />
        </div>
        <p class="col-name">{{ col.name }}</p>
        <p class="muted small">{{ col.count }} recordings</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.page {
  padding: 1rem;
}

.profile-header {
  text-align: center;
  margin-bottom: 1.5rem;
}
.avatar {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: linear-gradient(135deg, #6366f1, #4f46e5);
  margin: 0 auto 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.8rem;
  font-weight: 700;
}
.profile-header h3 {
  margin: 0;
  font-size: 1.1rem;
}
.handle {
  margin: 2px 0 0;
  color: #888;
  font-size: 0.85rem;
}
.stats {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  margin-top: 1rem;
}
.stat {
  text-align: center;
}
.stat-num {
  display: block;
  font-size: 1.1rem;
  font-weight: 700;
}
.stat-label {
  font-size: 0.75rem;
  color: #888;
}
.divider {
  width: 1px;
  height: 28px;
  background: #444;
}

.tabs {
  display: flex;
  border-bottom: 1px solid #333;
  margin-bottom: 1rem;
}
.tab-btn {
  flex: 1;
  padding: 10px;
  background: none;
  border: none;
  border-bottom: 2px solid transparent;
  color: #888;
  font-size: 0.9rem;
  cursor: pointer;
  transition:
    color 0.2s,
    border-color 0.2s;
}
.tab-btn.active {
  color: white;
  border-bottom-color: #6366f1;
}

.empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 3rem 1rem;
  text-align: center;
  color: #555;
}

.post-item {
  display: flex;
  gap: 12px;
  background: #2a2a2a;
  border-radius: 10px;
  overflow: hidden;
  margin-bottom: 10px;
}
.post-thumb {
  width: 84px;
  min-width: 84px;
  background: linear-gradient(135deg, #2d2d4e, #1a1a2e);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  color: #6366f1;
}
.thumb-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.post-info {
  flex: 1;
  min-width: 0;
  padding: 10px 10px 10px 0;
}
.post-title {
  margin: 0 0 2px;
  font-size: 0.9rem;
  font-weight: 600;
}
.post-desc {
  margin: 0 0 6px;
  font-size: 0.78rem;
  color: #aaa;
  line-height: 1.3;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.muted {
  margin: 0 0 3px;
  font-size: 0.75rem;
  color: #888;
}
.muted.small {
  font-size: 0.7rem;
  color: #555;
}

.audio-row {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 6px;
}
.play-btn {
  background: none;
  border: none;
  color: #6366f1;
  font-size: 1.3rem;
  padding: 0;
  cursor: pointer;
}
.play-btn:hover {
  color: #818cf8;
}
.mini-wave {
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

.post-tags {
  display: flex;
  gap: 4px;
  flex-wrap: wrap;
  margin-bottom: 4px;
}
.tag {
  background: #3a3a3a;
  border: 1px solid #555;
  border-radius: 4px;
  padding: 1px 6px;
  font-size: 0.68rem;
  text-transform: capitalize;
}

.collections-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}
.collection-card {
  background: #2a2a2a;
  padding: 10px;
  border-radius: 10px;
  text-align: center;
}
.col-images {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4px;
  height: 64px;
  margin-bottom: 8px;
}
.col-images .pi {
  opacity: 0.25;
  font-size: 1.2rem;
  align-self: center;
  justify-self: center;
}
.col-name {
  margin: 0;
  font-size: 0.85rem;
  font-weight: 600;
}
</style>
