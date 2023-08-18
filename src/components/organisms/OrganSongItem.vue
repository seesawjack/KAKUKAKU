<template>
  <div class="max-md:!w-full flex justify-center max-md:px-5 mt-5"
    :class="widthContainer">
    <mols-song-item/>
    <mols-configure v-if="songDisplay.show"
      class="max-md:fixed sticky max-md:top-1 top-12 max-md:right-7 z-50 h-[24px] translate-x-4 transition-all" />
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useLyricStore } from "../../stores/song";

import MolsSongItem from "../molecules/MolsSongItem.vue";
import MolsConfigure from "../molecules/MolsConfigure.vue";

const {
  songPageOption: { selected },
  songDisplay
} = useLyricStore();

const widthContainer = computed(() => {
  if (songDisplay.show) {
    return selected.dramaMode ? 'w-[72.5%]' : 'w-1/2';
  }
  return 'max-w-[600px] w-full'
})
</script>
