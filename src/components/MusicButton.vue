<script setup>
import { ref } from 'vue';

const isPlaying = ref(false);

const playMusic = () => {
  if (isPlaying.value) return;
  
  isPlaying.value = true;
  
  // Simple oscillator beep sequence as placeholder music
  const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  
  const playNote = (freq, time, duration) => {
    const oscillator = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();
    
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(freq, audioCtx.currentTime + time);
    
    gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime + time);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + time + duration);
    
    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    
    oscillator.start(audioCtx.currentTime + time);
    oscillator.stop(audioCtx.currentTime + time + duration);
  };

  // "Twinkle Twinkle Little Star" first few notes
  playNote(261.63, 0, 0.4); // C4
  playNote(261.63, 0.5, 0.4); // C4
  playNote(392.00, 1.0, 0.4); // G4
  playNote(392.00, 1.5, 0.4); // G4
  playNote(440.00, 2.0, 0.4); // A4
  playNote(440.00, 2.5, 0.4); // A4
  playNote(392.00, 3.0, 0.8); // G4

  setTimeout(() => {
    isPlaying.value = false;
    audioCtx.close();
  }, 4000);
};
</script>

<template>
  <button 
    class="music-btn" 
    @click="playMusic" 
    :disabled="isPlaying"
    :class="{ 'playing': isPlaying }"
  >
    <span class="icon">🎵</span>
    <span class="text">Play Music</span>
  </button>
</template>

<style scoped>
.music-btn {
  background-color: #FF9FF3;
  color: white;
  padding: 15px 30px;
  border-radius: 50px;
  font-size: 1.5rem;
  font-weight: bold;
  display: flex;
  align-items: center;
  gap: 10px;
  box-shadow: 0 4px 10px rgba(0,0,0,0.2);
  transition: all 0.3s ease;
}

.music-btn:hover:not(:disabled) {
  transform: scale(1.05);
  background-color: #f368e0;
}

.music-btn.playing {
  animation: pulse 1s infinite;
  background-color: #f368e0;
  cursor: default;
}

@keyframes pulse {
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
}

.icon {
  font-size: 2rem;
}
</style>
