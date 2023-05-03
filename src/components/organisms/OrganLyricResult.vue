<template>
  <div class="flex flex-col max-w-[650px] mx-auto">
    <atmos-video /> 
    <atmos-lyric 
    :lyrics="lyric"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import AtmosVideo from "../../components/atmos/AtmosVideo.vue";
import AtmosLyric from "../../components/atmos/AtmosLyric.vue";
import { useHiraganaStore } from "../../stores/hiragana";

const hiraganaStore = useHiraganaStore()
const lyric = ref(hiraganaStore.resultLyrics)
</script>

<style>
</style>