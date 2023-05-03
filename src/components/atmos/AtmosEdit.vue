<template>
  <div>
    <textarea
      class="resize-none bg-[transparent] border border-solid rounded-xl py-2 px-5"
      cols="53"
      rows="14"
      ref="lyric"
    ></textarea>
    <div class="flex">
      <button class="flex-1 border border-solid rounded-xl mr-2" @click="sendLyric">確定</button>
      <button class="flex-1 border border-solid rounded-xl">上傳歌詞</button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const lyric = ref('');
const emit = defineEmits(['getLyric']);

function sendLyric(){
  emit('getLyric',lyric.value.value)
}
</script>

<style>
</style>