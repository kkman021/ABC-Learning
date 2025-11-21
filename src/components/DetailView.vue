<script setup>
import { onMounted, onUnmounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import { alphabet } from '../data/alphabet';

const router = useRouter();

const props = defineProps({
  item: Object,
});

const speakWord = () => {
  if (!window.speechSynthesis) return;

  // Cancel any current speech
  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(props.item.word);
  utterance.lang = 'en-US';
  utterance.rate = 0.8;
  utterance.pitch = 1.2;

  window.speechSynthesis.speak(utterance);
};

const handleNext = () => {
  if (!props.item) return;

  const currentIndex = alphabet.findIndex(a => a.letter === props.item.letter);
  const nextIndex = (currentIndex + 1) % alphabet.length;
  const nextLetter = alphabet[nextIndex].letter;

  router.push(`/letter/${nextLetter}`);
};

const startGame = () => {
  router.push(`/letter/${props.item.letter}/game`);
};

watch(() => props.item, () => {
  speakWord();
});

onMounted(() => {
  // Auto-speak when entering detail view
  setTimeout(speakWord, 500);
});

onUnmounted(() => {
  // Cancel speech when leaving
  if (window.speechSynthesis) {
    window.speechSynthesis.cancel();
  }
});
</script>

<template>
  <div class="detail-view">
    <button class="back-btn" @click="router.push('/')">
      ← Back
    </button>

    <!-- Normal View -->
    <div class="content" @click="speakWord">
      <div class="letter-display" :style="{ color: item.color, textShadow: '2px 2px 4px rgba(0,0,0,0.2)' }">{{ item.letter }}</div>
      <img :src="item.image" :alt="item.word" class="main-image" loading="lazy" decoding="async" />
      <div class="word-display" :style="{ color: item.color, textShadow: '2px 2px 4px rgba(0,0,0,0.2)' }">{{ item.word }}</div>
      <div class="hint">Tap to hear again!</div>
    </div>

    <div class="controls">
      <button class="game-btn" @click="startGame">
        ❓ Find it out!
      </button>
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
  justify-content: flex-start;
  padding: 20px;
  overflow-y: auto;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.back-btn {
  align-self: flex-start;
  background: rgba(255, 255, 255, 0.95);
  border: 2px solid rgba(0, 0, 0, 0.1);
  padding: 10px 20px;
  border-radius: 30px;
  color: var(--text-color);
  font-size: 1.2rem;
  font-weight: bold;
  cursor: pointer;
  backdrop-filter: blur(5px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  transition: all 0.2s ease;
}

.back-btn:active {
  transform: scale(0.95);
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.2);
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
  margin-top: 30px;
  margin-bottom: 20px;
  flex-wrap: wrap;
}

.next-btn, .game-btn {
  background: white;
  color: var(--text-color);
  border: none;
  padding: 15px 30px;
  border-radius: 50px;
  font-size: 1.5rem;
  font-weight: bold;
  box-shadow: 0 4px 15px rgba(0,0,0,0.1);
}

.game-btn {
  background: #FFC700;
  color: #2C3E50;
}

@media (max-width: 600px) {
  .detail-view {
    padding: 15px;
  }

  .back-btn {
    padding: 12px 24px;
    font-size: 1.1rem;
    min-width: 80px;
    min-height: 44px;
  }

  .letter-display { font-size: 5rem; }
  .main-image { width: 200px; height: 200px; }
  .word-display { font-size: 2.5rem; }
  .controls { flex-direction: column; align-items: center; }
}
</style>
