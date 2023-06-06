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
    <button
      class="mt-3 border border-solid rounded-xl mr-2 hover:bg-slate-600"
      :class="{ isAdd: addLyricBtn.length === 3 }"
      @click="addLyric"
    >
      {{ addLyricBtn }}
    </button>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch, toRefs } from "vue";
import { useRouter, useRoute } from "vue-router";
import { storeToRefs } from "pinia";
import { useAuthStore } from "../../stores/auth";
import { useLyricStore } from "../../stores/lyric";
import { useGlobalStore } from "../../stores/index";
import useSupabase from "../../stores/supabase";
import AtmosVideo from "../../components/atmos/AtmosVideo.vue";
import AtmosLyric from "../../components/atmos/AtmosLyric.vue";
import AtmosDialog from "../atmos/AtmosDialog.vue";

const route = useRoute();
const router = useRouter();

const {
  lyricConfiguration: { selected },
} = useLyricStore();
const { resultLyrics, initLyrics, hiraganaLyrics, romajiLyrics } =
  useLyricStore();

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

const { isLoggedIn } = useAuthStore();
const { isError } = useGlobalStore();
let { isLoading } = toRefs(useGlobalStore());
const { supabase } = useSupabase();

const path = computed(() => route.path.replace("/", ""));

const addLyricBtn = ref("儲存建立");

async function addLyric() {
  if (addLyricBtn.value.length === 3) {
    return;
  }
  if (!isLoggedIn()) {
    isError({ isError: true, message: "會員登入後方可使用收藏功能" });
    return;
  }
  if (!resultLyrics.length) {
    isError({ isError: true, message: "產生歌詞後方可使用收藏功能" });
    return;
  }
  isLoading.value = true;
  const { data, error } = await supabase.from("lyrics").insert([
    {
      lyric_name: "Red:birthMark",
      user_id: "123",
      lyrics: JSON.stringify(resultLyrics),
      lyrics_hiragana: JSON.stringify(hiraganaLyrics),
      lyrics_romaji: JSON.stringify(romajiLyrics),
    },
  ]);
  addLyricBtn.value = "已新增";
  isLoading.value = false;
}
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

.isAdd {
  --tw-bg-opacity: 1;
  cursor: not-allowed;
  background-color: rgb(71 85 105 / var(--tw-bg-opacity));
  color: darkgrey;
  font-weight: 900;
}
</style>