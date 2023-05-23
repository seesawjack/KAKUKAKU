<template>
  <atmos-dialog
    :show="isError"
    title="請輸入 / 貼上 / 上傳歌詞"
    @close="showDialog"
  />
  <atmos-edit @getLyric="transformLyrics" @showError="showDialog" />
</template>

<script setup>
import { ref } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useLyricStore } from "../../stores/lyric";
import AtmosEdit from "../atmos/AtmosEdit.vue";
import AtmosDialog from "../atmos/AtmosDialog.vue";

const router = useRouter();
const route = useRoute();
const { generateHiraganaLyrics } = useLyricStore();
const isError = ref(false);

async function transformLyrics(value) {
  await generateHiraganaLyrics(value);
  router.push(`/song?video=${route.query.search}`);
}
function showDialog(value) {
  isError.value = value ? true : false;
}
</script>
