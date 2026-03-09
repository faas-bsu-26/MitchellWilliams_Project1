<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import TabMenu from 'primevue/tabmenu'
import Button from 'primevue/button'

const route  = useRoute()
const router = useRouter()

const topNavRoutes = ['Record', 'Explore', 'Projects']
const showTopNav   = computed(() => topNavRoutes.includes(route.name))

const topNavItems = [
  { label: 'Record',   icon: 'pi pi-microphone', command: () => router.push('/record')   },
  { label: 'Explore',  icon: 'pi pi-compass',    command: () => router.push('/explore')  },
  { label: 'Projects', icon: 'pi pi-folder',     command: () => router.push('/projects') },
]

const activeTabIndex = computed(() => topNavRoutes.indexOf(route.name))

const bottomNav = [
  { icon: 'pi pi-search',     route: 'Search'  },
  { icon: 'pi pi-globe',      route: 'Map'     },
  { icon: 'pi pi-plus-circle', route: 'Record', large: true },
  { icon: 'pi pi-chart-line', route: 'Explore' },
  { icon: 'pi pi-user',       route: 'Profile' },
]
</script>

<template>
  <div class="app-container">
    <header v-if="showTopNav" class="top-nav">
      <TabMenu :activeIndex="activeTabIndex" :model="topNavItems" />
    </header>

    <main class="content-area">
      <router-view />
    </main>

    <footer class="bottom-nav">
      <Button
        v-for="item in bottomNav" :key="item.route"
        :icon="item.icon"
        :size="item.large ? 'large' : undefined"
        text
        :class="{ active: route.name === item.route }"
        @click="router.push(item.route.toLowerCase())"
      />
    </footer>
  </div>
</template>

<style>
body {
  margin: 0;
  background-color: #121212;
}

.app-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  max-width: 420px;
  margin: 0 auto;
  background-color: #1e1e1e;
  color: white;
  font-family: sans-serif;
}

.content-area {
  flex: 1;
  padding: 1.5rem;
  overflow-y: auto;
}

.bottom-nav {
  display: flex;
  justify-content: space-around;
  padding: 0.8rem 0;
  background: #121212;
  border-top: 1px solid #333;
}

.active { color: #6366f1 !important; }
.w-full { width: 100%; }
</style>