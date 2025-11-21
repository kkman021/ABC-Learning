<script setup>
import { ref, computed } from 'vue';
import LetterGrid from './components/LetterGrid.vue';
import DetailView from './components/DetailView.vue';
import QuizView from './components/QuizView.vue'; // Import QuizView
import { alphabet } from './data/alphabet';

const currentMode = ref('grid'); // 'grid', 'detail', or 'quiz'
const selectedLetter = ref(null);

// 隨機選擇一個單字和圖片
const getRandomWord = (item) => {
  const randomIndex = Math.floor(Math.random() * item.words.length);
  return {
    letter: item.letter,
    word: item.words[randomIndex],
    image: item.images[randomIndex],
    color: item.color
  };
};

const handleSelectLetter = (item) => {
  selectedLetter.value = getRandomWord(item);
  currentMode.value = 'detail';
};

const handleBack = () => {
  currentMode.value = 'grid';
  selectedLetter.value = null;
};

const handleNext = () => {
  if (!selectedLetter.value) return;

  const currentIndex = alphabet.findIndex(item => item.letter === selectedLetter.value.letter);
  const nextIndex = (currentIndex + 1) % alphabet.length;
  selectedLetter.value = getRandomWord(alphabet[nextIndex]);
};

// Function to toggle between grid and quiz modes
const toggleMode = () => {
  currentMode.value = currentMode.value === 'grid' ? 'quiz' : 'grid';
  selectedLetter.value = null; // Clear selected letter when changing mode
};
</script>

<template>
  <div class="app-container">
    <header class="main-header">
      <h1>ABC Learning Game</h1>
      <p v-if="currentMode === 'grid'">Tap a letter to learn!</p>
      <p v-else-if="currentMode === 'quiz'">Test your knowledge!</p>
      <button @click="toggleMode" class="mode-toggle-button">
        {{ currentMode === 'grid' ? 'Start Quiz' : 'Back to Learning' }}
      </button>
    </header>

    <transition name="fade" mode="out-in">
      <LetterGrid
        v-if="currentMode === 'grid'"
        @selectLetter="handleSelectLetter"
      />

      <DetailView
        v-else-if="currentMode === 'detail'"
        :item="selectedLetter"
        @back="handleBack"
        @next="handleNext"
      />

      <QuizView
        v-else-if="currentMode === 'quiz'"
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
  position: relative; /* Added for button positioning */
  width: 100%; /* Ensure header takes full width for button */
  padding-bottom: 20px; /* Space for the button */
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

.mode-toggle-button {
  position: absolute;
  top: 20px; /* Adjust as needed */
  right: 20px; /* Adjust as needed */
  padding: 10px 15px;
  background-color: #f0ad4e;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1em;
  transition: background-color 0.3s ease;
}

.mode-toggle-button:hover {
  background-color: #ec971f;
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

@media (max-width: 600px) {
  .main-header h1 {
    font-size: 2rem;
    margin-bottom: 15px;
  }

  .main-header p {
    font-size: 1.2rem;
  }

  .mode-toggle-button {
    position: static;
    margin-top: 15px;
    width: 100%;
    max-width: 200px;
  }
}
</style>

