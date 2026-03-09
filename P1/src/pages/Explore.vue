<script setup>
</script>

<template>
  <div class="explore-tab">
    <div class="header">
      <h2>TRENDING</h2>
      <i class="pi pi-filter" />
    </div>

    <div class="card">
      <div class="card-image">
        <i class="pi pi-image" />
      </div>
      <div class="card-body">
        <h4>Title / Location / Date</h4>
        <p>Description/Info: Lorem ipsum</p>
        <div class="tags">
          <span class="tag">Tag</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.explore-tab { padding: 1rem; }

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
  height: 180px;
  background: #333;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
}
.card-body { padding: 1rem; }
.card-body h4 { margin: 0 0 4px; }
.card-body p  { margin: 0; font-size: 0.9rem; color: #ccc; }

.tags { display: flex; gap: 6px; margin-top: 10px; }
.tag {
  background: #444;
  border: 1px solid #555;
  border-radius: 4px;
  padding: 2px 8px;
  font-size: 0.7rem;
}
</style>