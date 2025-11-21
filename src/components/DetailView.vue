<script setup>
import { onMounted, watch, ref } from 'vue';
import MusicButton from './MusicButton.vue';
import { alphabet } from '../data/alphabet';

const props = defineProps({
  item: Object,
});

const emit = defineEmits(['back', 'next']);

const isGameActive = ref(false);
const gameOptions = ref([]);

const speakWord = () => {
  if (!window.speechSynthesis || isGameActive.value) return;
  
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

const playSound = (type) => {
  const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  const oscillator = audioCtx.createOscillator();
  const gainNode = audioCtx.createGain();
  
  oscillator.connect(gainNode);
  gainNode.connect(audioCtx.destination);
  
  if (type === 'success') {
    // Ding! (High pitch sine wave)
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(523.25, audioCtx.currentTime); // C5
    oscillator.frequency.exponentialRampToValueAtTime(1046.5, audioCtx.currentTime + 0.1); // C6
    gainNode.gain.setValueAtTime(0.3, audioCtx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.5);
    oscillator.start();
    oscillator.stop(audioCtx.currentTime + 0.5);
  } else {
    // Buzz! (Low pitch sawtooth)
    oscillator.type = 'sawtooth';
    oscillator.frequency.setValueAtTime(150, audioCtx.currentTime);
    oscillator.frequency.linearRampToValueAtTime(100, audioCtx.currentTime + 0.3);
    gainNode.gain.setValueAtTime(0.3, audioCtx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.3);
    oscillator.start();
    oscillator.stop(audioCtx.currentTime + 0.3);
  }
};

const startGame = () => {
  isGameActive.value = true;
  // Get current letter + 3 random others
  const others = alphabet.filter(a => a.letter !== props.item.letter);
  const shuffledOthers = others.sort(() => 0.5 - Math.random()).slice(0, 3);
  const options = [props.item, ...shuffledOthers];
  // Shuffle options
  gameOptions.value = options.sort(() => 0.5 - Math.random());
};

const checkAnswer = (option) => {
  if (option.letter === props.item.letter) {
    playSound('success');
    setTimeout(() => {
      isGameActive.value = false;
      emit('back'); // Return to list view on success
    }, 1000);
  } else {
    playSound('error');
  }
};

watch(() => props.item, () => {
  if (!isGameActive.value) {
    speakWord();
  }
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
    
    <!-- Normal View -->
    <div v-if="!isGameActive" class="content" @click="speakWord">
      <div class="letter-display">{{ item.letter }}</div>
      <img :src="item.image" :alt="item.word" class="main-image" />
      <div class="word-display">{{ item.word }}</div>
      <div class="hint">Tap to hear again!</div>
    </div>

    <!-- Game View -->
    <div v-else class="game-content">
      <h2 class="game-title">Which one is {{ item.letter }}?</h2>
      <div class="options-grid">
        <div 
          v-for="option in gameOptions" 
          :key="option.letter"
          class="option-card"
          @click="checkAnswer(option)"
        >
          <img :src="option.image" class="option-image" />
        </div>
      </div>
    </div>
    
    <div v-if="!isGameActive" class="controls">
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

.game-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-width: 600px;
  animation: popIn 0.5s ease;
}

.game-title {
  font-size: 3rem;
  color: white;
  margin-bottom: 30px;
  text-shadow: 2px 2px 4px rgba(0,0,0,0.2);
}

.options-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
  width: 100%;
}

.option-card {
  background: white;
  border-radius: 20px;
  padding: 15px;
  display: flex;
  align-items: center;
  justify-content: center;
  aspect-ratio: 1;
  cursor: pointer;
  transition: transform 0.2s;
  box-shadow: 0 4px 10px rgba(0,0,0,0.1);
}

.option-card:active {
  transform: scale(0.95);
}

.option-image {
  width: 100%;
  height: 100%;
  object-fit: contain;
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
  background: #FFE66D;
  color: #2C3E50;
}

@media (max-width: 600px) {
  .letter-display { font-size: 5rem; }
  .main-image { width: 200px; height: 200px; }
  .word-display { font-size: 2.5rem; }
  .controls { flex-direction: column; align-items: center; }
  .game-title { font-size: 2rem; }
}
</style>
