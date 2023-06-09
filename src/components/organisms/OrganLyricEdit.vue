<template>
  <div class="flex flex-col max-w-[510px] mx-auto mt-10">
    <div v-if="showCard" class="relative">
      <atmos-card
        :id="songInfo.id"
        :url="songInfo.url"
        :width="songInfo.width"
        :height="songInfo.height"
        :title="songInfo.title"
        :subTitle="songInfo.subTitle"
      />
      <atmos-keywords />
    </div>
    <mols-edit />
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { useRoute } from "vue-router";
import { useLyricStore } from "../../stores/lyric";
import AtmosCard from "../atmos/AtmosCard.vue";
import AtmosKeywords from "../atmos/AtmosKeywords.vue";
import MolsEdit from "../molecules/MolsEdit.vue";

const route = useRoute();
const { songInfo } = useLyricStore();
const showCard = ref(false);

onMounted(() => {
  if (route.query.song_id) {
    return (showCard.value = route.query.song_id === songInfo.id);
  }
});
</script>

<style>
</style>