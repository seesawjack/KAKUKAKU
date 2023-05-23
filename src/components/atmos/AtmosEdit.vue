<template>
  <div>
    <textarea
      class="resize-none bg-[transparent] border border-solid rounded-xl py-2 px-5"
      cols="53"
      rows="14"
      v-model.trim="lyric"
      placeholder="輸入 / 貼上 / 上傳歌詞"
    ></textarea>
    <div class="flex">
      <button
        class="flex-1 border border-solid rounded-xl mr-2 hover:bg-slate-600"
        @click="sendLyric"
      >
        確定
      </button>
      <button class="flex-1 border border-solid rounded-xl">上傳歌詞</button>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";

const emit = defineEmits(["getLyric", "showError"]);
const lyric = ref("");

async function sendLyric() {
  if (!lyric.value.length) {
    emit("showError", true);
  } else {
    emit("getLyric", lyric.value);
  }
}
</script>

<style>
</style>