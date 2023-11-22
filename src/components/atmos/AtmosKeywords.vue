<template>
  <div class="mt-3 mb-4 flex flex-wrap">
    <ul class="flex items-center flex-wrap">
      <li class="mr-3">
        <span class="p-1 bg-slate-700 rounded text-xs">歌詞關鍵字搜尋</span>
      </li>
      <li v-for="(word, index) in keywords" :key="index">
        <a
          :href="`https://www.google.com/search?q=${word}+歌詞`"
          target="_blank"
          class="p-1 bg-slate-600 rounded text-xs mb-3"
          :class="{ 'mr-3': index != keywords.length - 1 }"
          >{{ word }}
        </a>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useLyricStore } from "../../stores/song";
import { useRegex } from "../../composables/useRegex";

const { songInfo } = useLyricStore();
const { songTitleRegex } = useRegex();

const keywords = ref(null);
keywords.value = songTitleRegex(songInfo.title)

</script>
