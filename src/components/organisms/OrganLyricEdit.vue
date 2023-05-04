<template>
  <div class="flex flex-col max-w-[510px] mx-auto">
    <div class="relative mb-5">
      <atmos-card
        :url="songInfo.url"
        :width="songInfo.width"
        :height="songInfo.height"
        :title="songInfo.title"
        :subTitle="songInfo.subTitle"
        :useAlone="true"
      />
    </div>
    <atmos-edit @getLyric="generateHiraganaLyrics" />
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter, useRoute } from "vue-router";
import { diff_match_patch } from "diff-match-patch";
import { useRequestStore } from "../../stores/request";
import { useHiraganaStore } from "../../stores/hiragana";
import { useGlobalStore } from '../../stores/index'
import AtmosCard from "../atmos/AtmosCard.vue";
import AtmosEdit from "../atmos/AtmosEdit.vue";

const reqStore = useRequestStore();
const hiraganaStore = useHiraganaStore();
const router = useRouter();
const globalStore = useGlobalStore();

const songInfo = globalStore.selectedSongInfo

async function generateHiraganaLyrics(lyric) {
  hiraganaStore.resultLyrics.length = 0;  //初始化
  const reqData = hiraganaStore.updateLyricsInput(lyric.replace(/\n/g, "||"));
  const hiraganaLyrics = await reqStore.request({
    url: "https://labs.goo.ne.jp/api/hiragana",
    method: "POST",
    sendData: reqData,
  });
  hiraganaStore.kanjiLabelHiragana(hiraganaLyrics.converted, lyric);
  router.push("/SongList/YzoNZ-ozS3o");
}
</script>

<style>
</style>