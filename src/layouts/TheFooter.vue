<template>
  <div class="bottom-0 text-slate-400 max-sm:text-xs text-sm p-5">
    <p>※ 此網站僅提供學習資源使用<br v-if="screen < 576">，歌曲及歌詞版權皆屬原創作者所有</p>
  </div>
</template>

<script setup>
import { ref } from "vue";
const screen = ref(window.innerWidth)
</script>