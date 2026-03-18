<script setup>
import { ref, computed } from "vue";
import { store } from "../store.js";

const query = ref("");
const isProjects = computed(() => store.activeTab === "Projects");
const scopeLabel = computed(() => (isProjects.value ? "Projects" : "Explore"));
const searchPool = computed(() =>
  isProjects.value ? store.communityProjects : store.explorePosts,
);
const topSearches = computed(() =>
  isProjects.value
    ? [
        "hiphop",
        "beat",
        "game",
        "film",
        "sfx",
      ]
    : [
        "nature",
        "urban",
        "birds",
        "ambient",
        "rain",
      ],
);

const results = computed(() => {
  if (!query.value.trim()) return [];
  const q = query.value.toLowerCase();
  return searchPool.value.filter(
    (item) =>
      item.title.toLowerCase().includes(q) ||
      (item.location || "").toLowerCase().includes(q) ||
      (item.description || "").toLowerCase().includes(q) ||
      (item.tags || []).some((t) => t.includes(q)),
  );
});
</script>

<template>
  <div class="page">
    <div class="search-bar">
      <i class="pi pi-search muted" />
      <input
        v-model="query"
        :placeholder="`Search ${scopeLabel}...`"
        class="search-input"
      />
      <button v-if="query" class="clear-btn" @click="query = ''">
        <i class="pi pi-times" />
      </button>
    </div>

    <p class="scope-badge">
      <i :class="isProjects ? 'pi pi-folder' : 'pi pi-compass'" /> Searching in
      <strong>{{ scopeLabel }}</strong>
    </p>

    <div v-if="query && results.length > 0">
      <p class="section-label">Results ({{ results.length }})</p>
      <div v-for="item in results" :key="item.id" class="result-item">
        <div class="result-thumb">
          <img
            v-if="item.photoPreview"
            :src="item.photoPreview"
            class="thumb-img"
            alt=""
          />
          <i
            v-else
            :class="isProjects ? 'pi pi-folder-open' : 'pi pi-headphones'"
          />
        </div>
        <div class="result-info">
          <p class="result-title">{{ item.title }}</p>
          <p v-if="item.location" class="muted">
            <i class="pi pi-map-marker" /> {{ item.location }}
          </p>
          <p v-if="item.author" class="muted">
            <i class="pi pi-user" /> {{ item.author }}
          </p>
          <div class="tags">
            <span v-for="tag in item.tags || []" :key="tag" class="tag">{{
              tag
            }}</span>
          </div>
        </div>
      </div>
    </div>

    <p v-else-if="query" class="empty">
      No results for "{{ query }}" in {{ scopeLabel }}
    </p>

    <div v-else>
      <p class="section-label">Top Searches</p>
      <ul class="top-list">
        <li v-for="(term, i) in topSearches" :key="i" @click="query = term">
          <i class="pi pi-trending-up" style="color: #6366f1" /> {{ term }}
          <i
            class="pi pi-arrow-up-right"
            style="margin-left: auto; color: #555"
          />
        </li>
      </ul>
    </div>
  </div>
</template>

<style scoped>
.page {
  padding: 1rem;
}

.search-bar {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 0 12px;
  background: #2a2a2a;
  border: 1px solid #444;
  border-radius: 10px;
  margin-bottom: 8px;
}
.search-bar:focus-within {
  border-color: #6366f1;
}
.search-input {
  flex: 1;
  padding: 12px 0;
  background: none;
  border: none;
  color: white;
  font-size: 0.95rem;
  outline: none;
}
.search-input::placeholder {
  color: #555;
}
.clear-btn {
  background: none;
  border: none;
  color: #666;
  padding: 0;
  cursor: pointer;
}
.clear-btn:hover {
  color: white;
}
.muted {
  font-size: 0.75rem;
  color: #888;
  margin: 0 0 3px;
}

.scope-badge {
  display: flex;
  align-items: center;
  gap: 5px;
  margin: 0 0 16px;
  font-size: 0.78rem;
  color: #666;
}
.scope-badge strong {
  color: #aaa;
}
.section-label {
  margin: 0 0 0.75rem;
  font-size: 0.8rem;
  color: #666;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.result-item {
  display: flex;
  gap: 12px;
  background: #2a2a2a;
  border-radius: 10px;
  overflow: hidden;
  margin-bottom: 8px;
  cursor: pointer;
  transition: background 0.2s;
}
.result-item:hover {
  background: #333;
}
.result-thumb {
  width: 64px;
  min-width: 64px;
  background: linear-gradient(135deg, #2d2d4e, #1a1a2e);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.3rem;
  color: #6366f1;
}
.thumb-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.result-info {
  padding: 10px 10px 10px 0;
}
.result-title {
  margin: 0 0 2px;
  font-size: 0.9rem;
  font-weight: 600;
}
.tags {
  display: flex;
  gap: 4px;
  flex-wrap: wrap;
}
.tag {
  background: #3a3a3a;
  border: 1px solid #555;
  border-radius: 4px;
  padding: 1px 6px;
  font-size: 0.68rem;
  text-transform: capitalize;
}

.empty {
  padding: 2rem;
  text-align: center;
  color: #555;
  font-size: 0.9rem;
}

.top-list {
  list-style: none;
  padding: 0;
  margin: 0;
}
.top-list li {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 13px 0;
  border-bottom: 1px solid #2a2a2a;
  font-size: 0.9rem;
  color: #ccc;
  text-transform: capitalize;
  cursor: pointer;
  transition: color 0.2s;
}
.top-list li:hover {
  color: white;
}
</style>
