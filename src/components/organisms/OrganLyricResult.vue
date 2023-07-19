<template>
  <div class="flex max-md:!w-full" :class="{'w-[72.5%]':selected.dramaMode,'w-1/2':!selected.dramaMode}">
    <mols-lyric-result />
    <mols-configure class="sticky top-12 z-50 h-[24px] translate-x-4 transition-all" />
  </div>
</template>

<script setup>
import { useLyricStore } from "../../stores/lyric";
import MolsLyricResult from "../molecules/MolsLyricResult.vue";
import MolsConfigure from "../molecules/MolsConfigure.vue";

const {
  lyricConfiguration: { selected },
} = useLyricStore();
</script>
