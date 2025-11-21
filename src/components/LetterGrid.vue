<script setup>
import LetterCard from './LetterCard.vue';
import { alphabet } from '../data/alphabet';

const emit = defineEmits(['selectLetter']);

const handleSelect = (item) => {
  emit('selectLetter', item);
};
</script>

<template>
  <div class="grid-container">
    <LetterCard
      v-for="item in alphabet"
      :key="item.letter"
      :letter="item.letter"
      :word="item.word"
      :image="item.image"
      :color="item.color"
      @select="handleSelect(item)"
    />
  </div>
</template>

<style scoped>
.grid-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 20px;
  width: 100%;
  max-width: 1200px;
  padding: 20px;
}

@media (max-width: 600px) {
  .grid-container {
    grid-template-columns: repeat(2, 1fr);
    gap: 15px;
    padding: 10px;
  }
}
</style>
