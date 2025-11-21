<script setup>
import { onMounted, onUnmounted, watch, ref } from 'vue';
import confetti from 'canvas-confetti';
import { alphabet } from '../data/alphabet';

const props = defineProps({
  item: Object,
});

const emit = defineEmits(['back', 'next']);

const isGameActive = ref(false);
const showSuccess = ref(false);
const gameOptions = ref([]);

// Create a single AudioContext for the component lifecycle
let audioCtx = null;
const getAudioContext = () => {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  return audioCtx;
};

// Cleanup AudioContext on component unmount
onUnmounted(() => {
  if (audioCtx) {
    audioCtx.close();
    audioCtx = null;
  }
});

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

let lastSoundTime = 0;
const playSound = (type) => {
  // Debounce: prevent playing sounds too frequently (min 100ms between sounds)
  const now = Date.now();
  if (now - lastSoundTime < 100) return;
  lastSoundTime = now;

  const ctx = getAudioContext();

  if (type === 'success') {
    // Victory fanfare!
    const currentTime = ctx.currentTime;

    // C5
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    osc1.frequency.value = 523.25;
    gain1.gain.setValueAtTime(0.2, currentTime);
    gain1.gain.exponentialRampToValueAtTime(0.01, currentTime + 0.4);
    osc1.start(currentTime);
    osc1.stop(currentTime + 0.4);

    // E5
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    osc2.frequency.value = 659.25;
    gain2.gain.setValueAtTime(0.2, currentTime + 0.1);
    gain2.gain.exponentialRampToValueAtTime(0.01, currentTime + 0.5);
    osc2.start(currentTime + 0.1);
    osc2.stop(currentTime + 0.5);

    // G5
    const osc3 = ctx.createOscillator();
    const gain3 = ctx.createGain();
    osc3.connect(gain3);
    gain3.connect(ctx.destination);
    osc3.frequency.value = 783.99;
    gain3.gain.setValueAtTime(0.2, currentTime + 0.2);
    gain3.gain.exponentialRampToValueAtTime(0.01, currentTime + 0.8);
    osc3.start(currentTime + 0.2);
    osc3.stop(currentTime + 0.8);

    // C6
    const osc4 = ctx.createOscillator();
    const gain4 = ctx.createGain();
    osc4.connect(gain4);
    gain4.connect(ctx.destination);
    osc4.frequency.value = 1046.50;
    gain4.gain.setValueAtTime(0.2, currentTime + 0.3);
    gain4.gain.exponentialRampToValueAtTime(0.01, currentTime + 1.2);
    osc4.start(currentTime + 0.3);
    osc4.stop(currentTime + 1.2);

  } else {
    // Buzz! (Low pitch sawtooth)
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    oscillator.type = 'sawtooth';
    oscillator.frequency.setValueAtTime(150, ctx.currentTime);
    oscillator.frequency.linearRampToValueAtTime(100, ctx.currentTime + 0.3);
    gainNode.gain.setValueAtTime(0.3, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
    oscillator.start();
    oscillator.stop(ctx.currentTime + 0.3);
  }
};

const startGame = () => {
  isGameActive.value = true;
  showSuccess.value = false;
  // Get current letter + 3 random others
  const others = alphabet.filter(a => a.letter !== props.item.letter);
  const shuffledOthers = others.sort(() => 0.5 - Math.random()).slice(0, 3);
  const options = [props.item, ...shuffledOthers];
  // Shuffle options
  gameOptions.value = options.sort(() => 0.5 - Math.random());
};

const checkAnswer = (option) => {
  if (option.letter === props.item.letter) {
    showSuccess.value = true;
    playSound('success');
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });
    
    setTimeout(() => {
      isGameActive.value = false;
      showSuccess.value = false;
      emit('back'); // Return to list view on success
    }, 2500);
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

    <!-- Success Overlay -->
    <div v-if="showSuccess" class="success-overlay">
      <div class="success-content">
        <div class="success-emoji">🎉</div>
        <div class="success-text">Great Job!</div>
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

.success-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 200;
  animation: fadeIn 0.3s ease;
}

.success-content {
  background: white;
  padding: 40px;
  border-radius: 30px;
  text-align: center;
  animation: bounceIn 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.success-emoji {
  font-size: 5rem;
  margin-bottom: 10px;
}

.success-text {
  font-size: 3rem;
  font-weight: 900;
  color: var(--primary-color);
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes bounceIn {
  0% { transform: scale(0); }
  50% { transform: scale(1.2); }
  100% { transform: scale(1); }
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
