<script setup>
import { ref } from "vue";

const pins = [
  {
    id: 1,
    title: "Birds atRed Rock Canyon",
    location: "Nevada, USA",
    lat: 36.135,
    lng: -115.4278,
  },
  {
    id: 2,
    title: "Downtown Echo",
    location: "Chicago, IL",
    lat: 41.8827,
    lng: -87.6233,
  },
  {
    id: 3,
    title: "Rainy Morning",
    location: "Olympic Natl. Park",
    lat: 47.8021,
    lng: -123.6044,
  },
];

const selected = ref(null);
const activeUrl = ref(
  "https://www.openstreetmap.org/export/embed.html?bbox=-130,24,-60,50&layer=mapnik",
);

function selectPin(pin) {
  selected.value = pin;
  activeUrl.value = `https://www.openstreetmap.org/export/embed.html?bbox=${pin.lng - 1},${pin.lat - 0.7},${pin.lng + 1},${pin.lat + 0.7}&layer=mapnik&marker=${pin.lat},${pin.lng}`;
}
</script>

<template>
  <div class="page">
    <div class="header">
      <h2>MAP</h2>
      <i class="pi pi-filter" />
    </div>
    <div class="map-container">
      <iframe
        :src="activeUrl"
        class="map-frame"
        frameborder="0"
        scrolling="no"
        allowfullscreen
      />
    </div>
    <div class="pin-list">
      <div
        v-for="pin in pins"
        :key="pin.id"
        class="pin-item"
        :class="{ active: selected?.id === pin.id }"
        @click="selectPin(pin)"
      >
        <i class="pi pi-map-marker" style="color: #6366f1; font-size: 1.1rem" />
        <div>
          <p class="pin-title">{{ pin.title }}</p>
          <p class="pin-loc">{{ pin.location }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.page {
  padding: 1rem;
}
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}
.header h2 {
  margin: 0;
  font-size: 1.1rem;
  letter-spacing: 2px;
  text-decoration: underline;
}
.map-container {
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid #333;
  margin-bottom: 1rem;
}
.map-frame {
  display: block;
  width: 100%;
  height: 260px;
}
.pin-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.pin-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 14px;
  background: #2a2a2a;
  border: 1px solid transparent;
  border-radius: 10px;
  cursor: pointer;
  transition: border-color 0.2s;
}
.pin-item:hover {
  border-color: #555;
}
.pin-item.active {
  border-color: #6366f1;
}
.pin-title {
  margin: 0;
  font-size: 0.9rem;
  font-weight: 600;
}
.pin-loc {
  margin: 2px 0 0;
  font-size: 0.75rem;
  color: #888;
}
</style>
