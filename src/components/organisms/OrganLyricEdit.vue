<template>
  <div class="flex flex-col max-w-[510px] mx-auto mt-10">
    <div v-if="idInUrl" class="relative">
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
    <mols-edit :isIdinUrl="idInUrl"/>
  </div>
</template>

<script setup>
import { ref, onMounted, computed,toRefs } from "vue";
import { useRoute } from "vue-router";
import { useLyricStore } from "../../stores/lyric";
import AtmosCard from "../atmos/AtmosCard.vue";
import AtmosKeywords from "../atmos/AtmosKeywords.vue";
import MolsEdit from "../molecules/MolsEdit.vue";

const route = useRoute();
const { songInfo } = toRefs(useLyricStore());
const idInUrl = ref(false);

onMounted(() => {
  if (route.query.song_id) {
    return idInUrl.value = route.query.song_id === songInfo.value.id;
  }
});
</script>

<style>
</style>