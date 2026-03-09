<script setup>
import InputText from 'primevue/inputtext'
import IconField from 'primevue/iconfield'
import InputIcon from 'primevue/inputicon'
</script>

<template>
  <div class="search-page">
    <IconField iconPosition="left">
      <InputIcon class="pi pi-search" />
      <InputText placeholder="Search..." class="w-full" />
    </IconField>

    <h4 class="section-label">Top Searches</h4>
    <ul class="search-list">
      <li v-for="i in 5" :key="i">Search {{ i }}</li>
    </ul>
  </div>
</template>

<style scoped>
.search-page { padding: 1rem; }

.section-label { margin: 1.5rem 0 0.5rem; opacity: 0.7; }

.search-list {
  list-style: none;
  padding: 0;
  margin: 0;
}
.search-list li {
  padding: 12px 0;
  border-bottom: 1px solid #333;
  opacity: 0.8;
}
</style>