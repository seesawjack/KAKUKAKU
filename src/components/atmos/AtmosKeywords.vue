<template>
  <div class="mt-3 mb-4 flex flex-wrap">
    <ul class="flex items-center flex-wrap">
      <li class="mr-3">
        <span class="p-1 bg-slate-700 rounded text-xs">歌詞關鍵字搜尋</span>
      </li>
      <li v-for="(key, index) in title" :key="index">
        <a
          :href="`https://www.google.com/search?q=${key}+歌詞`"
          target="_blank"
          class="p-1 bg-slate-600 rounded text-xs mb-3"
          :class="{ 'mr-3': index != title.length - 1 }"
          >{{ key }}
        </a>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useLyricStore } from "../../stores/song";
import { useRegexStore } from "../../stores/regex";

const { songInfo } = useLyricStore();
const { songTitleRegex } = useRegexStore();

const title = ref(songTitleRegex(songInfo.title));

</script>
