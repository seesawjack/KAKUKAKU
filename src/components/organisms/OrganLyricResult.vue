<template>
  <div class="flex flex-col max-w-[650px] mx-auto">
    <atmos-dialog :show="!!error" title="偵測" @close="handleError">
      <p class="text-white text-center">{{ error }}</p>
    </atmos-dialog>
    <atmos-video :id="videoId" v-if="videoId" />
    <atmos-lyric :lyrics="lyric" :className="[showHiragana,showHiraganaWord]" />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from "vue";
import { useRouter, useRoute } from "vue-router";
import AtmosVideo from "../../components/atmos/AtmosVideo.vue";
import AtmosLyric from "../../components/atmos/AtmosLyric.vue";
import AtmosDialog from "../atmos/AtmosDialog.vue";
import { useHiraganaStore } from "../../stores/hiragana";
import { useGlobalStore } from "../../stores/index";
const route = useRoute();
const router = useRouter();
const error = ref(null);

function handleError() {
  error.value = null;
}
const global = useGlobalStore();
const hiraganaStore = useHiraganaStore();
const lyric = ref(
  hiraganaStore.resultLyrics.map(
    (sentence, i) =>
      sentence +
      `<p class="hiragana">${hiraganaStore.hiraganaLyrics[i]}</p>` +
      `<span class="romaji">${hiraganaStore.romajiLyrics[i]}</span>`
  )
);

const videoId = computed(() => {
  return route.query.video;
});

onMounted(() => {
  if (!videoId.value) {
    error.value = "未找到來源";
    router.push("/songlist");
  }
});

let showHiragana = ref("");
let showHiraganaWord = ref("")
watch(
  () => global.lyricConfiguration.labelTypeSelected,
  () => {
    const labelType = global.lyricConfiguration.labelTypeSelected;
    switch (labelType) {
      case "none":
        showHiragana.value = "hiddenHiragana";
        break;
      case "hiragana":
        showHiragana.value = "";
        break;
      case "romaji":
        showHiragana.value = "onlyhiragana";
        break;
      default:
        break;
    }
  }
);

watch(()=>global.lyricConfiguration.allHiragana,()=>{
  if(global.lyricConfiguration.allHiragana){
    showHiraganaWord.value ="showHiragana";
    return;
  }
  showHiraganaWord.value = ""
})
</script>

<style>
.hiddenHiragana rt {
  display: none;
}
.hiragana , .romaji{
  display: none;
}
.onlyhiragana .romaji{
  display: block;
}
.showHiragana .hiragana{
  display: block;
}
</style>