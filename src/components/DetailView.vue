<script setup>
import { onMounted, watch } from 'vue';
import MusicButton from './MusicButton.vue';

const props = defineProps({
  item: Object,
});

const emit = defineEmits(['back', 'next']);

const speakWord = () => {
  if (!window.speechSynthesis) return;
  
  // Cancel any current speech
  window.speechSynthesis.cancel();
  
  const utterance = new SpeechSynthesisUtterance(props.item.word);
  utterance.lang = 'en-US';
  utterance.rate = 0.8; // Slightly slower for kids
  utterance.pitch = 1.2; // Slightly higher pitch for friendliness
  
  window.speechSynthesis.speak(utterance);
};

const handleNext = () => {
  emit('next');
};

watch(() => props.item, () => {
  speakWord();
});

onMounted(() => {
  // Auto-speak when entering detail view
  setTimeout(speakWord, 500);
});
</script>

<template>
  <div class="detail-view" :style="{ backgroundColor: item.color }">
    <button class="back-btn" @click="$emit('back')">
      ← Back
    </button>
    
    <div class="content" @click="speakWord">
      <div class="letter-display">{{ item.letter }}</div>
      <img :src="item.image" :alt="item.word" class="main-image" />
      <div class="word-display">{{ item.word }}</div>
      <div class="hint">Tap to hear again!</div>
    </div>
    
    <div class="controls">
      <MusicButton v-if="item.letter === 'A'" />
      <button class="next-btn" @click="handleNext">
        Next Letter →
      </button>
    </div>
  </div>
</template>

<style scoped>
.detail-view {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 100;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  padding: 20px;
  overflow-y: auto;
}

.back-btn {
  align-self: flex-start;
  background: rgba(255, 255, 255, 0.3);
  border: none;
  padding: 10px 20px;
  border-radius: 30px;
  color: white;
  font-size: 1.2rem;
  font-weight: bold;
  cursor: pointer;
  backdrop-filter: blur(5px);
}

.content {
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
  animation: popIn 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

@keyframes popIn {
  from { transform: scale(0.5); opacity: 0; }
  to { transform: scale(1); opacity: 1; }
}

.letter-display {
  font-size: 8rem;
  font-weight: 900;
  color: white;
  text-shadow: 4px 4px 8px rgba(0,0,0,0.2);
  line-height: 1;
}

.main-image {
  width: 300px;
  height: 300px;
  object-fit: contain;
  margin: 20px 0;
  filter: drop-shadow(0 10px 20px rgba(0,0,0,0.2));
  transition: transform 0.3s ease;
}

.content:active .main-image {
  transform: scale(0.9);
}

.word-display {
  font-size: 4rem;
  font-weight: 800;
  color: white;
  text-transform: uppercase;
  letter-spacing: 2px;
  text-shadow: 2px 2px 4px rgba(0,0,0,0.2);
}

.hint {
  color: rgba(255, 255, 255, 0.8);
  margin-top: 10px;
  font-size: 1.2rem;
}

.controls {
  width: 100%;
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-bottom: 20px;
  flex-wrap: wrap;
}

.next-btn {
  background: white;
  color: var(--text-color);
  border: none;
  padding: 15px 40px;
  border-radius: 50px;
  font-size: 1.5rem;
  font-weight: bold;
  box-shadow: 0 4px 15px rgba(0,0,0,0.1);
}

@media (max-width: 600px) {
  .letter-display { font-size: 5rem; }
  .main-image { width: 200px; height: 200px; }
  .word-display { font-size: 2.5rem; }
  .controls { flex-direction: column; align-items: center; }
}
</style>
