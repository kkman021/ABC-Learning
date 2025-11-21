<script setup>
import { computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';

const router = useRouter();
const route = useRoute();

const isHomePage = computed(() => route.name === 'home');
const isQuizPage = computed(() => route.name === 'quiz');

const toggleMode = () => {
  if (isQuizPage.value) {
    router.push('/');
  } else {
    router.push('/quiz');
  }
};
</script>

<template>
  <div class="app-container">
    <header v-if="isHomePage" class="main-header">
      <h1>ABC Learning Game</h1>
      <p>Tap a letter to learn!</p>
      <button @click="toggleMode" class="mode-toggle-button">
        Start Quiz
      </button>
    </header>

    <button v-else-if="isQuizPage" @click="toggleMode" class="back-button-quiz">
      ← Back
    </button>

    <transition name="fade" mode="out-in">
      <router-view />
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
  position: relative;
  width: 100%;
  padding-bottom: 20px;
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
  top: 20px;
  right: 20px;
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

.back-button-quiz {
  position: fixed;
  top: 20px;
  left: 20px;
  padding: 10px 20px;
  background: rgba(255, 255, 255, 0.95);
  border: 2px solid rgba(0, 0, 0, 0.1);
  border-radius: 30px;
  color: var(--text-color);
  font-size: 1.1rem;
  font-weight: bold;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  transition: all 0.2s ease;
  z-index: 1000;
}

.back-button-quiz:active {
  transform: scale(0.95);
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.2);
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
  .main-header {
    margin-bottom: 20px;
    padding-bottom: 0;
  }

  .main-header h1 {
    font-size: 2rem;
    margin-bottom: 15px;
  }

  .main-header p {
    font-size: 1.2rem;
    margin-bottom: 10px;
  }

  .mode-toggle-button {
    position: static;
    margin-top: 10px;
    margin-bottom: 20px;
    width: 100%;
    max-width: 200px;
  }

  .back-button-quiz {
    top: 10px;
    left: 10px;
    padding: 10px 18px;
    font-size: 1rem;
    min-height: 44px;
  }
}
</style>
