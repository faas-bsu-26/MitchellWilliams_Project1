<script setup>
import Button from 'primevue/button'
</script>

<template>
  <div class="projects-tab">
    <div class="header">
      <h2>COMMUNITY</h2>
      <i class="pi pi-filter" />
    </div>

    <div class="card">
      <div class="card-image">
        <i class="pi pi-play" />
      </div>
      <div class="card-body">
        <h4>Project Name</h4>
        <div class="card-meta">
          <span><i class="pi pi-heart" /> 15</span>
          <span><i class="pi pi-comment" /> 2</span>
        </div>
      </div>
    </div>

    <Button icon="pi pi-plus" label="Add Project" severity="secondary" outlined class="w-full add-btn" />
  </div>
</template>

<style scoped>
.projects-tab { padding: 1rem; }

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
  height: 120px;
  background: #333;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
}
.card-body { padding: 1rem; }
.card-body h4 { margin: 0 0 8px; }

.card-meta { display: flex; gap: 15px; font-size: 0.85rem; }

.add-btn { margin-top: 0.5rem; }
</style>