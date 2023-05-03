<template>
  <div class="flex flex-col max-w-[510px] mx-auto">
    <div class="relative mb-5">
      <atmos-card
        :url="'https://i.ytimg.com/vi/YzoNZ-ozS3o/hqdefault.jpg'"
        :width="120"
        :height="90"
        :title="'【LIVE映像】「フラッシュバッカー」/ ぼっち・ざ・ろっく！-SPECIAL STUDIO LIVE-'"
        :subTitle="'アニプレックス チャンネル'"
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
import AtmosCard from "../atmos/AtmosCard.vue";
import AtmosEdit from "../atmos/AtmosEdit.vue";

const reqStore = useRequestStore();
const hiraganaStore = useHiraganaStore();
const router = useRouter();

async function generateHiraganaLyrics(lyric) {
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