<script setup>
import { ref, computed } from 'vue';
import LetterGrid from './components/LetterGrid.vue';
import DetailView from './components/DetailView.vue';
import { alphabet } from './data/alphabet';

const currentView = ref('grid'); // 'grid' or 'detail'
const selectedLetter = ref(null);

const handleSelectLetter = (item) => {
  selectedLetter.value = item;
  currentView.value = 'detail';
};

const handleBack = () => {
  currentView.value = 'grid';
  selectedLetter.value = null;
};

const handleNext = () => {
  if (!selectedLetter.value) return;
  
  const currentIndex = alphabet.findIndex(item => item.letter === selectedLetter.value.letter);
  const nextIndex = (currentIndex + 1) % alphabet.length;
  selectedLetter.value = alphabet[nextIndex];
};
</script>

<template>
  <div class="app-container">
    <header v-if="currentView === 'grid'" class="main-header">
      <h1>ABC Learning Game</h1>
      <p>Tap a letter to learn!</p>
    </header>

    <transition name="fade" mode="out-in">
      <LetterGrid 
        v-if="currentView === 'grid'" 
        @selectLetter="handleSelectLetter" 
      />
      
      <DetailView 
        v-else 
        :item="selectedLetter" 
        @back="handleBack"
        @next="handleNext"
      />
    </transition>
  </div>
</template>

<style scoped>
.app-container {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.main-header {
  text-align: center;
  margin-bottom: 30px;
  animation: slideDown 0.5s ease;
}

.main-header h1 {
  font-size: 3rem;
  color: var(--primary-color);
  margin-bottom: 10px;
  text-shadow: 2px 2px 0px rgba(0,0,0,0.1);
}

.main-header p {
  font-size: 1.5rem;
  color: var(--text-color);
  opacity: 0.8;
}

@keyframes slideDown {
  from { transform: translateY(-20px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
