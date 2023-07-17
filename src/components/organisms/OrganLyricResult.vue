<template>
  <div class="flex">
    <mols-lyric-result />
    <mols-configure
      class="sticky top-12 z-50 h-[24px] translate-x-4 transition-all"
    />
  </div>
</template>

<script setup>
import MolsLyricResult from "../molecules/MolsLyricResult.vue";
import MolsConfigure from "../molecules/MolsConfigure.vue";
</script>
