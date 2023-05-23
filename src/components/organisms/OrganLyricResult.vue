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
      :className="[showHiragana, showHiraganaWord]"
    />
  </div>
</template>

<script setup>
import { ref, toRefs, computed, onMounted, watch } from "vue";
import { useRouter, useRoute } from "vue-router";
import AtmosVideo from "../../components/atmos/AtmosVideo.vue";
import AtmosLyric from "../../components/atmos/AtmosLyric.vue";
import AtmosDialog from "../atmos/AtmosDialog.vue";
import { useLyricStore } from "../../stores/lyric";
import { useGlobalStore } from "../../stores/index";

const route = useRoute();
const router = useRouter();

const globalStore = useGlobalStore();
const { lyricConfiguration } = globalStore;
const { selected } = toRefs(lyricConfiguration);
const lyricStore = useLyricStore();

const lyrics = ref(
  lyricStore.resultLyrics.map(
    (sentence, i) =>
      sentence +
      `<p class="hiragana">${lyricStore.hiraganaLyrics[i]}</p>` +
      `<span class="romaji">${lyricStore.romajiLyrics[i]}</span>`
  )
);

const videoId = computed(() => {
  return route.query.video;
});

const showHiragana = ref("");
const showHiraganaWord = ref("");
const isfixedVideo = ref(false);

watch(
  () => selected.value.labelType,
  () => {
    switch (selected.value.labelType) {
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

watch(
  () => selected.value.allHiragana,
  () => {
    showHiraganaWord.value = selected.value.allHiragana ? "showHiragana" : "";
  }
);

watch(
  () => selected.value.fixedVideo,
  () => {
    isfixedVideo.value = selected.value.fixedVideo ? true : false;
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