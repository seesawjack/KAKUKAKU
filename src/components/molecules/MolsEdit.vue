<template>
  <atmos-edit @getLyric="transformLyrics" @showError="showDialog" />
</template>

<script setup>
import { ref } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useLyricStore } from "../../stores/lyric";
import { useGlobalStore } from "../../stores/index";
import AtmosEdit from "../atmos/AtmosEdit.vue";

const router = useRouter();
const route = useRoute();
const { generateHiraganaLyrics } = useLyricStore();
const { isError } = useGlobalStore();


async function transformLyrics(value) {
  await generateHiraganaLyrics(value);
  router.push(`/song?video=${route.query.search}`);
}
function showDialog(value) {
  if(value){
    isError({ isError: true, message: "請輸入 / 貼上 / 上傳歌詞" })
  }
}
</script>
