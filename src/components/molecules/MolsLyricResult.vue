<template>
  <div>
    <div v-if="!isShow" class="flex flex-col max-w-[640px] mx-auto">
      <atmos-video :id="songId" v-if="songId" :class="isfixedVideo" />
      <atmos-lyric :lyrics="lyrics" :hiraganaLyrics="hiraLyrics" :romajiLyrics="romaLyrics" class="max-w-[640px] relative"
        :className="[labelType, allHiragana]"/>
      <button class="mt-3 border border-solid rounded-xl mr-2 hover:bg-slate-600"
        :class="{ unclickable: confirmButton.unclickable }" @click="addLyric">
        {{ confirmButton.text }}
      </button>
    </div>
    <atmos-not-found v-else :tips="message" />
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, watch, toRefs } from "vue";
import { useRouter, useRoute } from "vue-router";
import { storeToRefs } from "pinia";
import { useAuthStore } from "../../stores/auth";
import { useLyricStore } from "../../stores/lyric";
import { useGlobalStore } from "../../stores/index";
import useSupabase from "../../stores/supabase";
import AtmosVideo from "../../components/atmos/AtmosVideo.vue";
import AtmosLyric from "../../components/atmos/AtmosLyric.vue";
import AtmosNotFound from "../atmos/AtmosNotFound.vue";
import AtmosPopup from "../atmos/AtmosPopup.vue";

const route = useRoute();
const router = useRouter();

const path = computed(() => route.path.replace("/", ""));
const songId = computed(() => route.query.song_id);

const {
  lyricConfiguration: { selected },
  tolyrics,
  removeLocal,
} = useLyricStore();

const { hiraganaLyrics, romajiLyrics, resultLyrics, songInfo, initLyrics, lyricTimeStamp } = toRefs(
  useLyricStore()
);


const lyrics = ref([]);
const hiraLyrics = ref([]);
const romaLyrics = ref([]);

const labelType = ref("");

const isShow = ref(false);
const message = ref("");

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
        labelType.value = "showRomaji";
        break;
      default:
        break;
    }
  }
);

const allHiragana = computed(() => {
  return { showHiragana: selected.allHiragana };
});

const isfixedVideo = computed(() => {
  return { fixedVideo: selected.fixedVideo };
});

const { isLoggedIn, userInfo } = useAuthStore();
const { isError, loadingState } = useGlobalStore();
const { supabase } = useSupabase();

const confirmButton = reactive({
  text: "儲存建立",
  state: "Add",
  unclickable: false,
});

function buttonState({ text, state, unclickable }) {
  confirmButton.text = text;
  confirmButton.state = state;
  confirmButton.unclickable = unclickable;
}

async function addLyric() {
  if (confirmButton.state === "isAdded") {
    return;
  }
  if (confirmButton.state === "Update") {
    return;
  }
  if (!isLoggedIn() || !resultLyrics.value.length) {
    return;
  }
  loadingState(true);

  const { data: lyricsListData, error: lyricsListError } = await supabase
    .from("lyrics_list")
    .insert([
      {
        user_id: userInfo.id,
        video_id: songInfo.value.id,
        title: songInfo.value.title,
        video_img: songInfo.value.url,
      },
    ]);

  const { data: lyricsContentData, error: lyricsContentError } = await supabase
    .from("lyrics_content")
    .insert([
      {
        user_id: userInfo.id,
        video_id: songInfo.value.id,
        hiragana: JSON.stringify(hiraganaLyrics.value),
        romaji: JSON.stringify(romajiLyrics.value),
        hanji: JSON.stringify(resultLyrics.value),
        timestamp: JSON.stringify(lyricTimeStamp.value)
      },
    ]);
  buttonState({ text: "已新增", state: "isAdded", unclickable: true });
  removeLocal();
  loadingState(false);
}

onMounted(async () => {
  if (!route.query.song_id) {
    isShow.value = true;
    message.value = "此歌曲尚未建立";
    return;
  }

  if (route.query.user) {
    if (route.query.user !== userInfo.user_metadata?.name) {
      isShow.value = true;
      message.value = "無法查看此歌曲";
      return;
    }

    let { data, error } = await supabase
      .from("lyrics_content")
      .select()
      .eq("video_id", route.query.song_id)
      .eq("user_id", userInfo.id);

    if (!data.length) {
      isShow.value = true;
      message.value = "無法查看此歌曲";
      return;
    }

    lyrics.value = JSON.parse(data[0].hanji);
    hiraLyrics.value = JSON.parse(data[0].hiragana);
    romaLyrics.value = JSON.parse(data[0].romaji);
    lyricTimeStamp.value = JSON.parse(data[0].timestamp);

    buttonState({
      text: "修改功能日後開放，敬請期待",
      state: "Update",
      unclickable: true,
    });
    return;
  }

  if (route.query.song_id === songInfo.value?.id) {
    await tolyrics(initLyrics.value);
    lyrics.value = resultLyrics.value
  }

  if (!resultLyrics.value.length) {
    isShow.value = true;
    message.value = "無法讀取歌詞，請稍後再嘗試";
    return;
  }

  if (!isLoggedIn()) {
    buttonState({ text: "登入後方可儲存歌曲", state: "", unclickable: true });
    return;
  }
  if (!resultLyrics.value.length) {
    buttonState({ text: "產生歌曲後方可儲存", state: "", unclickable: true });
    return;
  }

  lyrics.value = resultLyrics.value;
  hiraLyrics.value = hiraganaLyrics.value;
  romaLyrics.value = romajiLyrics.value;
});
</script>

<style>
.hiddenHiragana rt {
  display: none;
}

.hiragana,
.romaji {
  display: none;
}

.showRomaji .romaji {
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
  z-index: 50;
}

.unclickable {
  --tw-bg-opacity: 1;
  cursor: not-allowed;
  background-color: rgb(71 85 105 / var(--tw-bg-opacity));
  color: darkgrey;
  font-weight: 900;
}
</style>