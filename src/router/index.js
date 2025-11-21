import { createRouter, createWebHashHistory } from 'vue-router';
import LetterGrid from '../components/LetterGrid.vue';
import DetailView from '../components/DetailView.vue';
import QuizView from '../components/QuizView.vue';
import { alphabet } from '../data/alphabet';

// 隨機選擇單字和圖片的輔助函數
function getRandomWord(letter) {
  const item = alphabet.find(a => a.letter === letter.toUpperCase());
  if (!item) return null;

  const randomIndex = Math.floor(Math.random() * item.words.length);
  return {
    letter: item.letter,
    word: item.words[randomIndex],
    image: item.images[randomIndex],
    color: item.color
  };
}

const routes = [
  {
    path: '/',
    name: 'home',
    component: LetterGrid
  },
  {
    path: '/letter/:letter',
    name: 'letter',
    component: DetailView,
    props: route => {
      const letterData = getRandomWord(route.params.letter);
      return { item: letterData };
    }
  },
  {
    path: '/quiz',
    name: 'quiz',
    component: QuizView
  }
];

const router = createRouter({
  // 使用 hash 模式以支援 GitHub Pages
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes
});

export default router;
