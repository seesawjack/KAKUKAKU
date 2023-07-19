<template>
  <div class="flex max-md:!w-full max-md:px-5" :class="{ 'w-[72.5%]': selected.dramaMode, 'w-1/2': !selected.dramaMode }">
    <mols-lyric-result />
    <mols-configure v-if="screen >768" class="sticky top-12 z-50 h-[24px] translate-x-4 transition-all" />
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useLyricStore } from "../../stores/lyric";
import MolsLyricResult from "../molecules/MolsLyricResult.vue";
import MolsConfigure from "../molecules/MolsConfigure.vue";

const screen = ref(window.innerWidth)
const {
  lyricConfiguration: { selected },
} = useLyricStore();
</script>
