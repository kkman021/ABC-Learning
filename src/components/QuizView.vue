<template>
  <div class="quiz-view">
    <div v-if="currentQuestion" class="quiz-content">
      <div class="image-container">
        <transition name="fade" mode="out-in">
          <img :key="currentQuestion.image" :src="currentQuestion.image" :alt="currentQuestion.word" class="quiz-image" loading="lazy" decoding="async" />
        </transition>
      </div>

      <button @click="replayAudio" class="replay-button">🔊 Replay</button>

      <div class="choices">
        <button
          v-for="choice in shuffledChoices"
          :key="choice"
          @click="selectChoice(choice)"
          :disabled="disabledChoices.includes(choice)"
          :class="{ 
            'correct-answer': showCorrectAnswer && choice === currentQuestion.word,
            'incorrect-answer': disabledChoices.includes(choice)
          }"
        >
          {{ choice }}
        </button>
      </div>

      <p v-if="feedback" :class="feedbackClass" class="feedback-message">{{ feedback }}</p>
      
    </div>
    <div v-else>
      <p>Loading quiz...</p>
    </div>
  </div>
</template>

<script>
import { onUnmounted } from 'vue';
import confetti from 'canvas-confetti';
import { alphabet as rawAlphabetData } from '../data/alphabet';

let audioCtx = null;
const getAudioContext = () => {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  return audioCtx;
};

export default {
  name: 'QuizView',
  setup() {
    onUnmounted(() => {
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
      if (audioCtx) {
        audioCtx.close();
        audioCtx = null;
      }
    });
  },
  data() {
    return {
      alphabet: rawAlphabetData.flatMap(letterEntry => 
        letterEntry.words.map((word, index) => ({
          word: word.toLowerCase(),
          image: letterEntry.images[index]
        }))
      ),
      currentQuestion: null,
      shuffledChoices: [],
      feedback: '',
      feedbackClass: '',
      showCorrectAnswer: false,
      disabledChoices: [],
      lastSoundTime: 0,
    };
  },
  created() {
    this.startQuiz();
  },
  methods: {
    startQuiz() {
      this.generateQuestion();
    },
    generateQuestion() {
      this.feedback = '';
      this.feedbackClass = '';
      this.showCorrectAnswer = false;
      this.disabledChoices = [];

      const randomIndex = Math.floor(Math.random() * this.alphabet.length);
      this.currentQuestion = this.alphabet[randomIndex];
      const correctWord = this.currentQuestion.word;

      const incorrectWords = [];
      const allWords = this.alphabet.map(item => item.word);
      while (incorrectWords.length < 3) {
        const randomWord = allWords[Math.floor(Math.random() * allWords.length)];
        if (randomWord !== correctWord && !incorrectWords.includes(randomWord)) {
          incorrectWords.push(randomWord);
        }
      }

      this.shuffledChoices = this.shuffleArray([correctWord, ...incorrectWords]);

      // Auto-play audio
      setTimeout(() => this.speakWord(), 500);
      setTimeout(() => this.speakWord(), 1500);
    },
    shuffleArray(array) {
      for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
      }
      return array;
    },
    selectChoice(choice) {
      if (this.showCorrectAnswer) return;

      if (choice === this.currentQuestion.word) {
        this.feedback = 'Excellent!';
        this.feedbackClass = 'correct-feedback';
        this.showCorrectAnswer = true;
        this.playSound('success');
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });

        // 語音說出 Excellent（開心且快速的語調）
        if (window.speechSynthesis) {
          window.speechSynthesis.cancel();
          const utterance = new SpeechSynthesisUtterance('Excellent!');
          utterance.lang = 'en-US';
          utterance.rate = 1.2;  // 快一點
          utterance.pitch = 1.5; // 開心的高音調
          window.speechSynthesis.speak(utterance);
        }

        setTimeout(() => {
          this.nextQuestion();
        }, 1500);

      } else {
        this.feedback = 'Try again!';
        this.feedbackClass = 'incorrect-feedback';
        this.disabledChoices.push(choice);
        this.playSound('error');
      }
    },
    speakWord() {
      if (!window.speechSynthesis || !this.currentQuestion) return;
      
      window.speechSynthesis.cancel();
      
      const utterance = new SpeechSynthesisUtterance(this.currentQuestion.word);
      utterance.lang = 'en-US';
      utterance.rate = 0.8;
      utterance.pitch = 1.2;
      
      window.speechSynthesis.speak(utterance);
    },
    replayAudio() {
      this.speakWord();
    },
    playSound(type) {
      const now = Date.now();
      if (now - this.lastSoundTime < 100) return;
      this.lastSoundTime = now;

      const ctx = getAudioContext();

      if (type === 'success') {
        const currentTime = ctx.currentTime;
        const osc1 = ctx.createOscillator();
        const gain1 = ctx.createGain();
        osc1.connect(gain1);
        gain1.connect(ctx.destination);
        osc1.frequency.value = 523.25;
        gain1.gain.setValueAtTime(0.2, currentTime);
        gain1.gain.exponentialRampToValueAtTime(0.01, currentTime + 0.4);
        osc1.start(currentTime);
        osc1.stop(currentTime + 0.4);

        const osc2 = ctx.createOscillator();
        const gain2 = ctx.createGain();
        osc2.connect(gain2);
        gain2.connect(ctx.destination);
        osc2.frequency.value = 659.25;
        gain2.gain.setValueAtTime(0.2, currentTime + 0.1);
        gain2.gain.exponentialRampToValueAtTime(0.01, currentTime + 0.5);
        osc2.start(currentTime + 0.1);
        osc2.stop(currentTime + 0.5);

      } else { // error
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
    },
    nextQuestion() {
      this.generateQuestion();
    }
  }
};
</script>

<style scoped>
.quiz-view {
  width: 100%;
  max-width: 600px;
  padding: 30px;
  display: flex;
  justify-content: center;
  align-items: flex-start;
}

.quiz-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  animation: slideUp 0.5s ease;
}

@keyframes slideUp {
  from { transform: translateY(20px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}

.image-container {
  position: relative;
  margin-bottom: 30px;
}

.quiz-image {
  width: clamp(180px, 40vw, 250px);
  height: auto;
  aspect-ratio: 1 / 1;
  object-fit: contain;
  border-radius: 20px;
  background-color: var(--card-bg);
  box-shadow: 0 10px 20px rgba(0,0,0,0.1), 0 3px 6px rgba(0,0,0,0.08);
  border: 4px solid white;
}

.replay-button {
  margin: 20px 0;
  padding: 12px 24px;
  border-radius: 25px;
  background-color: var(--secondary-color);
  color: white;
  font-size: 1.1rem;
  font-weight: 600;
  border: none;
  box-shadow: 0 2px 8px rgba(0,0,0,0.15);
  cursor: pointer;
  transition: all 0.2s ease;
}

.replay-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.2);
  background-color: #45b8af;
}

.choices {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 15px;
  width: 100%;
  margin-bottom: 25px;
}

.choices button {
  padding: 18px;
  font-size: 1.3rem;
  font-weight: 500;
  border-radius: 12px;
  background-color: var(--card-bg);
  color: var(--text-color);
  border: 2px solid #E0E0E0;
  transition: all 0.2s ease;
}

.choices button:hover:not(:disabled) {
  transform: translateY(-3px);
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
  border-color: var(--secondary-color);
}

.choices button:disabled {
  cursor: not-allowed;
  opacity: 0.7;
}

.choices button.correct-answer {
  background-color: #A7E9AF; /* A softer green */
  border-color: #64C36F;
  color: #1A5321;
  transform: scale(1.05);
  animation: pulse 0.5s;
}

@keyframes pulse {
  0% { transform: scale(1.05); }
  50% { transform: scale(1.1); }
  100% { transform: scale(1.05); }
}

.choices button.incorrect-answer {
  background-color: #FFCBCB; /* A softer red */
  border-color: #E88080;
  color: #7B2D2D;
  text-decoration: line-through;
  opacity: 0.6;
}

.feedback-message {
  font-size: 1.8rem;
  font-weight: bold;
  height: 30px; /* Reserve space */
  margin-bottom: 20px;
}

.correct-feedback {
  color: #388E3C;
}

.incorrect-feedback {
  color: #D32F2F;
}

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}

@media (max-width: 600px) {
  .quiz-view {
    padding: 10px;
  }

  .image-container {
    margin-bottom: 20px;
  }

  .replay-button {
    margin: 15px 0;
    font-size: 1rem;
    padding: 10px 20px;
  }

  .choices {
    gap: 10px;
  }

  .choices button {
    padding: 15px;
    font-size: 1.1rem;
  }

  .feedback-message {
    font-size: 1.5rem;
  }
}
</style>
