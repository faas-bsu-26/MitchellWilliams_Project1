<script setup>
import { ref } from 'vue'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'

const step = ref(1)
const next = () => { if (step.value < 3) step.value++ }
</script>

<template>
  <div class="record-tab">
    <div class="steps">
      <Button v-for="n in 3" :key="n" :label="String(n)"
        :severity="step === n ? 'primary' : 'secondary'"
        @click="step = n" rounded />
    </div>

    <div v-if="step === 1">
      <Button icon="pi pi-upload" label="Upload a File" severity="secondary" class="w-full" />
      <div class="waveform">Waveform</div>
      <p class="time">Time 00:12:45</p>
      <div class="step-footer">
        <Button icon="pi pi-circle-fill" severity="danger" rounded />
        <Button label="Next" icon="pi pi-arrow-right" iconPos="right" @click="next" />
      </div>
    </div>

    <div v-if="step === 2">
      <Button icon="pi pi-upload" label="Upload a File" severity="secondary" class="w-full" />
      <div class="image-placeholder large">
        <i class="pi pi-image" />
      </div>
      <div class="step-footer">
        <Button icon="pi pi-camera" severity="secondary" rounded />
        <Button label="Next" icon="pi pi-arrow-right" iconPos="right" @click="next" />
      </div>
    </div>

    <div v-if="step === 3">
      <div class="image-placeholder small">
        <i class="pi pi-image" />
      </div>
      <div class="fields">
        <InputText placeholder="Title" class="w-full" />
        <InputText placeholder="Info" class="w-full" />
        <InputText placeholder="Tags" class="w-full" />
      </div>
      <Button label="Post" severity="success" class="w-full post-btn" @click="step = 1" />
    </div>
  </div>
</template>

<style scoped>
.record-tab { padding: 1rem; }

.steps {
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-bottom: 2rem;
}

.waveform {
  height: 100px;
  background: #333;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 1rem;
}
.time { text-align: center; margin: 0.5rem 0; }

.image-placeholder {
  background: #2a2a2a;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 1rem;
}
.image-placeholder.large  { height: 200px; font-size: 3rem; }
.image-placeholder.small  { height: 120px; font-size: 2rem; }

.step-footer {
  display: flex;
  justify-content: space-between;
  margin-top: 2rem;
}

.fields { display: flex; flex-direction: column; gap: 0.5rem; margin-top: 1rem; }
.post-btn { margin-top: 1.5rem; }
</style>