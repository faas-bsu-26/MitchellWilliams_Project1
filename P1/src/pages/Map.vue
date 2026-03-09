<script setup>
import Button from 'primevue/button'
</script>

<template>
  <div class="map-view">
    <Button icon="pi pi-filter" severity="secondary" rounded class="filter-btn" />
    <i class="pi pi-map-marker map-icon" />
    <p>Interactive Map View</p>
  </div>
</template>

<style scoped>
.map-view {
  position: relative;
  min-height: 400px;
  background: #242424;
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
.filter-btn { position: absolute; top: 10px; right: 10px; }
.map-icon   { font-size: 2rem; color: #6366f1; }
</style>