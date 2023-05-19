<template>
  <div class="flex flex-col max-w-[510px] mx-auto">
    <div class="relative">
      <atmos-card
        v-if="showCard"
        :id="songInfo.id"
        :url="songInfo.url"
        :width="songInfo.width"
        :height="songInfo.height"
        :title="songInfo.title"
        :subTitle="songInfo.subTitle"
      />
    </div>
    <atmos-keywords/>
    <atmos-edit @getLyric="generateHiraganaLyrics" />
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useRequestStore } from "../../stores/request";
import { useHiraganaStore } from "../../stores/hiragana";
import { useGlobalStore } from "../../stores/index";
import AtmosCard from "../atmos/AtmosCard.vue";
import AtmosEdit from "../atmos/AtmosEdit.vue";
import AtmosKeywords from '../atmos/AtmosKeywords.vue';

const reqStore = useRequestStore();
const hiraganaStore = useHiraganaStore();
const router = useRouter();
const route = useRoute();
const globalStore = useGlobalStore();
const showCard = ref(false);

const songInfo = computed(() => {
  return (
    globalStore.selectedSongInfo ||
    JSON.parse(localStorage.getItem("songHistory"))
  );
});

async function generateHiraganaLyrics(lyric) {
  hiraganaStore.resultLyrics.length = 0; //初始化
  const reqData = hiraganaStore.updateLyricsInput(lyric.replace(/\n/g, "||"));

  const requestLyrics = await reqStore.request({
    url: "https://labs.goo.ne.jp/api/hiragana",
    method: "POST",
    sendData: reqData,
  });
  const hiraganaLyrics = requestLyrics.converted.split('||').map(i=>i.trim().replace(/[\s](?!\s)/mg,''))
  hiraganaStore.hiraganaLyrics = hiraganaLyrics;
  hiraganaStore.kanjiLabelHiragana(hiraganaLyrics, lyric);
  router.push(`/song?video=${route.query.search}`);
}
onMounted(() => {
  if (route.query.search) {
    return showCard.value =
      route.query.search === songInfo.value.id ? true : false;
  }
});
</script>

<style>
</style>