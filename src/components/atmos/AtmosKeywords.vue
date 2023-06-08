<template>
  <div class="mt-3 mb-4 flex flex-wrap">
    <ul class="flex items-center flex-wrap">
      <li><button @click="showsonginfo">點擊</button></li>
      <li class="mr-3">
        <span class="p-1 bg-slate-700 rounded text-xs">歌詞關鍵字搜尋</span>
      </li>
      <li v-for="(key, index) in keywords" :key="index">
        <a
          :href="`https://www.google.com/search?q=${key}+歌詞`"
          target="_blank"
          class="p-1 bg-slate-600 rounded text-xs mb-3"
          :class="{ 'mr-3': index != keywords.length - 1 }"
          >{{ key }}
        </a>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { storeToRefs } from "pinia";
import { ref, toRefs, computed } from "vue";
import { useLyricStore } from "../../stores/lyric";

const { songInfo } = useLyricStore();
const title = computed(()=>songInfo)
// const { selectedSong } = useLyricStore();

// const title = computed(() => lyricStore.selectedSongInfo.title);

// const info = JSON.parse(localStorage.getItem("songHistory"));
function showsonginfo() {
  // selectedSong(info);
  // console.log(
  //   "%c 結果(紅) ",
  //   "background: #EA0000; color: #ffffff",
  //  title.value
  // );
  console.log('%c 結果(紅) ', 'background: #EA0000; color: #ffffff',title.value);
}

// {"id":"I8Y5Twgnnq0","url":"https://i.ytimg.com/vi/I8Y5Twgnnq0/mqdefault.jpg","width":120,"height":90,"title":"彩雲國物語 OP - はじまりの風","subTitle":"micha"}
// const keywords = title.value
//   ?.split(
//     /[^\u3000-\u303f\u3040-\u309f\u30a0-\u30ff\uff00-\uff9f\u4e00-\u9faf\u3400-\u4dbf\w]/g
//   )
//   .map((i) => i.trim())
//   .filter((i) => i != "");
</script>
