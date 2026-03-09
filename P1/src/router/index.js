import { createRouter, createWebHistory } from 'vue-router'
import Explore from '../pages/Explore.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', redirect: '/explore' },
    { path: '/explore', name: 'Explore', component: Explore },
    { path: '/record', name: 'Record', component: () => import('../pages/Record.vue') },
    { path: '/projects', name: 'Projects', component: () => import('../pages/Projects.vue') },
    { path: '/search', name: 'Search', component: () => import('../pages/Search.vue') },
    { path: '/map', name: 'Map', component: () => import('../pages/Map.vue') },
    { path: '/profile', name: 'Profile', component: () => import('../pages/Profile.vue') }
  ]
})

export default router