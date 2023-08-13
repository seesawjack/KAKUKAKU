<template>
  <div class="flex flex-col max-md:px-5 max-w-[510px] mx-auto mt-10">
    <div v-if="isYoutubeSearch" class="relative">
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
    <mols-edit :isYoutubeSearch="isYoutubeSearch"/>
  </div>
</template>

<script setup>
import { ref, onMounted,toRefs } from "vue";
import { useRoute } from "vue-router";
import { useLyricStore } from "../../stores/song";

import AtmosCard from "../atmos/AtmosCard.vue";
import AtmosKeywords from "../atmos/AtmosKeywords.vue";
import MolsEdit from "../molecules/MolsEdit.vue";

const route = useRoute();
const { songInfo } = toRefs(useLyricStore());
const isYoutubeSearch = ref(false);

//根據網址參數的 song_id 是否符合 API 中對應的 id 值來顯示已選歌曲的資訊
onMounted(() => {
  if (route.query.song_id) {
    return isYoutubeSearch.value = route.query.song_id === songInfo.value.id;
  }
});
</script>

<style>
</style>