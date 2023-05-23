<template>
  <div class="flex flex-col max-w-[640px] mx-auto">
    <atmos-video
      :id="videoId"
      v-if="videoId"
      :class="[isfixedVideo ? 'fixedVideo' : '']"
    />
    <atmos-lyric
      :lyrics="lyrics"
      class="max-w-[640px]"
      :className="[labelType, allHiragana]"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from "vue";
import { useRouter, useRoute } from "vue-router";
import AtmosVideo from "../../components/atmos/AtmosVideo.vue";
import AtmosLyric from "../../components/atmos/AtmosLyric.vue";
import AtmosDialog from "../atmos/AtmosDialog.vue";
import { useLyricStore } from "../../stores/lyric";
import { useGlobalStore } from "../../stores/index";

const route = useRoute();
const router = useRouter();

const { lyricConfiguration:{selected} } = useGlobalStore();
const { resultLyrics,hiraganaLyrics,romajiLyrics } = useLyricStore();

const lyrics = ref(
  resultLyrics.map(
    (sentence, i) =>
      sentence +
      `<p class="hiragana">${hiraganaLyrics[i]}</p>` +
      `<span class="romaji">${romajiLyrics[i]}</span>`
  )
);

const videoId = computed(() => {
  return route.query.video;
});

const labelType = ref("");
const allHiragana = ref("");
const isfixedVideo = ref(false);

watch(
  () => selected.labelType,
  () => {
    switch (selected.labelType) {
      case "none":
        labelType.value = "hiddenHiragana";
        break;
      case "hiragana":
        labelType.value = "";
        break;
      case "romaji":
        labelType.value = "onlyhiragana";
        break;
      default:
        break;
    }
  }
);

watch(
  () => selected.allHiragana,
  () => {
    allHiragana.value = selected.allHiragana ? "showHiragana" : "";
  }
);

watch(
  () => selected.fixedVideo,
  () => {
    isfixedVideo.value = selected.fixedVideo || false;
  }
);
</script>

<style>
.hiddenHiragana rt {
  display: none;
}
.hiragana,
.romaji {
  display: none;
}
.onlyhiragana .romaji {
  display: block;
}
.showHiragana .hiragana {
  display: block;
}
.showHiragana .init,
.showHiragana .romaji {
  display: none;
}
.fixedVideo {
  position: sticky;
  top: 0px;
}
</style>