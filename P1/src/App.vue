<script setup>
import { computed, ref, provide } from "vue";
import { useRoute, useRouter } from "vue-router";
import { store } from "./store.js";

const route = useRoute();
const router = useRouter();

const topTabs = [
  { label: "Record", icon: "pi pi-microphone", path: "/record" },
  { label: "Explore", icon: "pi pi-compass", path: "/explore" },
  { label: "Projects", icon: "pi pi-folder", path: "/projects" },
];

function goTab(tab) {
  store.activeTab = tab.label;
  router.push(tab.path);
}

const showAddProject = ref(false);
provide("showAddProject", showAddProject);

const bottomNav = computed(() => {
  const items = [
    {
      id: "search",
      label: "Search",
      icon: "pi pi-search",
      active: route.name === "Search",
      action: () => router.push("/search"),
    },
  ];
  if (store.activeTab === "Explore")
    items.push({
      id: "map",
      label: "Map",
      icon: "pi pi-globe",
      active: route.name === "Map",
      action: () => router.push("/map"),
    });
  if (store.activeTab === "Projects")
    items.push({
      id: "add",
      label: "Add",
      icon: "pi pi-plus-circle",
      large: true,
      active: false,
      action: () => {
        showAddProject.value = true;
      },
    });
  items.push({
    id: "profile",
    label: "Profile",
    icon: "pi pi-user",
    active: route.name === "Profile",
    action: () => router.push("/profile"),
  });
  return items;
});
</script>

<template>
  <div class="app">
    <header class="top-nav">
      <button
        v-for="tab in topTabs"
        :key="tab.label"
        class="top-tab"
        :class="{ active: store.activeTab === tab.label }"
        @click="goTab(tab)"
      >
        <i :class="tab.icon" /> {{ tab.label }}
      </button>
    </header>
    <nav class="bottom-nav">
      <button
        v-for="item in bottomNav"
        :key="item.id"
        class="nav-btn"
        :class="{ active: item.active, large: item.large }"
        @click="item.action()"
      >
        <i :class="item.icon" />
        <span class="nav-label">{{ item.label }}</span>
      </button>
    </nav>
    <main class="content"><router-view /></main>
  </div>
</template>

<style>
* {
  box-sizing: border-box;
}
body {
  margin: 0;
  background: #121212;
}

.app {
  display: flex;
  flex-direction: column;
  height: 100vh;
  max-width: 420px;
  margin: 0 auto;
  background: #1e1e1e;
  color: white;
  font-family: sans-serif;
}

.top-nav {
  display: flex;
  background: #121212;
  border-bottom: 1px solid #2a2a2a;
  flex-shrink: 0;
}
.top-tab {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 13px 0;
  background: none;
  border: none;
  border-bottom: 2px solid transparent;
  color: #555;
  font-size: 0.82rem;
  cursor: pointer;
  transition:
    color 0.2s,
    border-color 0.2s;
}
.top-tab.active {
  color: white;
  border-bottom-color: #6366f1;
}
.top-tab:hover:not(.active) {
  color: #aaa;
}

.bottom-nav {
  display: flex;
  justify-content: space-around;
  align-items: center;
  padding: 0.4rem 0;
  background: #121212;
  border-bottom: 1px solid #2a2a2a;
  flex-shrink: 0;
}
.nav-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 3px;
  padding: 6px 16px;
  background: none;
  border: none;
  color: #555;
  font-size: 1.2rem;
  border-radius: 8px;
  cursor: pointer;
  transition: color 0.2s;
}
.nav-label {
  font-size: 0.65rem;
  letter-spacing: 0.02em;
}
.nav-btn.large {
  font-size: 1.7rem;
  color: #6366f1;
}
.nav-btn.large:hover {
  color: #818cf8;
}
.nav-btn.active {
  color: #6366f1;
}
.nav-btn:hover:not(.active):not(.large) {
  color: #aaa;
}

.content {
  flex: 1;
  padding: 1.5rem;
  overflow-y: auto;
}

.w-full {
  width: 100%;
}
</style>
