<script setup>
import Button from 'primevue/button'
</script>

<template>
  <div class="profile-page">
    <div class="profile-header">
      <div class="avatar">M</div>
      <h3>Name</h3>
      <div class="profile-actions">
        <Button label="Posts" text />
        <Button label="Collections" text />
      </div>
    </div>

    <div class="collections-grid">
      <div v-for="i in 4" :key="i" class="collection-card">
        <div class="collection-images">
          <i v-for="j in 4" :key="j" class="pi pi-image" />
        </div>
        <p>Collection {{ i }}</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.profile-page { padding: 1rem; }

.profile-header { text-align: center; }
.profile-header h3 { margin: 4px 0; }

.avatar {
  width: 80px;
  height: 80px;
  background: #4a1414;
  border-radius: 50%;
  margin: 0 auto 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
}

.profile-actions {
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-top: 0.5rem;
}

.collections-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 15px;
  margin-top: 1.5rem;
}

.collection-card {
  background: #2a2a2a;
  padding: 10px;
  border-radius: 8px;
  text-align: center;
}
.collection-card p { font-size: 0.8rem; margin: 6px 0 0; }

.collection-images {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4px;
  height: 60px;
}
.collection-images .pi { opacity: 0.3; }
</style>