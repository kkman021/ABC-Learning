<script setup>
defineProps({
  letter: String,
  word: String,
  image: String,
  color: String,
});

const emit = defineEmits(['select']);

const handleClick = () => {
  emit('select');
};
</script>

<template>
  <div 
    class="letter-card" 
    :style="{ backgroundColor: color }"
    @click="handleClick"
  >
    <div class="letter-content">
      <span class="letter">{{ letter }}</span>
      <img :src="image" :alt="word" class="letter-image" />
      <span class="word">{{ word }}</span>
    </div>
  </div>
</template>

<style scoped>
.letter-card {
  border-radius: 20px;
  padding: 15px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  aspect-ratio: 1;
  box-shadow: 0 4px 15px rgba(0,0,0,0.1);
  transition: transform 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.letter-card:hover {
  transform: scale(1.05) rotate(2deg);
  z-index: 1;
}

.letter-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  height: 100%;
  justify-content: space-between;
}

.letter {
  font-size: 4rem;
  font-weight: 900;
  color: white;
  text-shadow: 2px 2px 4px rgba(0,0,0,0.2);
  line-height: 1;
}

.letter-image {
  width: 60%;
  height: 60%;
  object-fit: contain;
  filter: drop-shadow(0 4px 6px rgba(0,0,0,0.1));
}

.word {
  font-size: 1.2rem;
  font-weight: 700;
  color: white;
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-top: 5px;
}

@media (max-width: 600px) {
  .letter {
    font-size: 3rem;
  }
  .word {
    font-size: 1rem;
  }
}
</style>
