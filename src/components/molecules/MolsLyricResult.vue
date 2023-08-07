<template>
  <div v-if="songState.show" class="w-full flex flex-col mx-auto">
    <atmos-video :id="songId" v-if="songId" :class="isfixedVideo" />
    <atmos-lyric
      :lyrics="lyrics"
      :hiraganaLyrics="hiraLyrics"
      :romajiLyrics="romaLyrics"
      class="relative"
      :className="[selected.labelType]"
    />
    <button
      v-if="!isRecommendState"
      class="mt-3 border border-solid rounded-xl mr-2 hover:bg-slate-600"
      :class="{ unclickable: confirmButton.unclickable }"
      @click="addSong"
    >
      {{ confirmButton.text }}
    </button>
  </div>
  <atmos-not-found v-else :tips="songState.message" />
</template>

<script setup>
import { ref, reactive, computed, onMounted, toRefs } from "vue";
import { useRoute } from "vue-router";
import { useAuthStore } from "../../stores/auth";
import { useLyricStore } from "../../stores/lyric";
import { useGlobalStore } from "../../stores";
import useSupabase from "../../stores/supabase";

import AtmosVideo from "../atmos/AtmosVideo.vue";
import AtmosLyric from "../atmos/AtmosLyric.vue";
import AtmosNotFound from "../atmos/AtmosNotFound.vue";

const route = useRoute();

const songId = computed(() => route.query.song_id);

const isRecommendState = ref(false);

const { isLoggedIn, userInfo } = useAuthStore();

const {
  lyricConfiguration: { selected },
  songState,
  tolyrics,
  removeLocal,
} = useLyricStore();

const {
  hiraganaLyrics,
  romajiLyrics,
  resultLyrics,
  songInfo,
  initLyrics,
  lyricTimeStamp,
  spaceIndex,
} = toRefs(useLyricStore());

const { supabase } = useSupabase();
const { loadingState } = useGlobalStore();

const lyrics = ref([]);
const hiraLyrics = ref([]);
const romaLyrics = ref([]);

function toSongState({ show, message }) {
  songState.show = show;
  songState.message = message;
}

const isfixedVideo = computed(() => {
  return { fixedVideo: selected.fixedVideo };
});

const confirmButton = reactive({
  text: "儲存建立",
  state: "Add",
  unclickable: false,
  isVisible: true,
});

function buttonState({ text, state, unclickable, isVisible }) {
  confirmButton.text = text;
  confirmButton.state = state;
  confirmButton.unclickable = unclickable;
  confirmButton.isVisible = isVisible;
}

//新增歌曲
async function addSong() {
  if (
    confirmButton.state === "isAdded" ||
    !isLoggedIn() ||
    !resultLyrics.value.length
  ) {
    return;
  }

  loadingState(true);

  if (confirmButton.state === "update") {
    const { data: lyricsListData, error: lyricsListError } = await supabase
      .from("lyrics_list")
      .update({ recommend: selected.isRecommend })
      .eq("video_id", route.query.song_id)
      .eq("user_id", userInfo.id);

    const { data: lyricsContentData, error: lyricsContentError } =
      await supabase
        .from("lyrics_content")
        .update({
          hiragana: JSON.stringify(hiraganaLyrics.value),
          romaji: JSON.stringify(romajiLyrics.value),
          hanji: JSON.stringify(resultLyrics.value),
          timestamp: JSON.stringify(lyricTimeStamp.value),
          spaceIndex: JSON.stringify(spaceIndex.value),
        })
        .eq("video_id", route.query.song_id)
        .eq("user_id", userInfo.id);

    buttonState({
      text: "已修改",
      state: "isAdded",
      unclickable: true,
    });

    removeLocal();
    loadingState(false);

    return;
  }

  const { data: lyricsListData, error: lyricsListError } = await supabase
    .from("lyrics_list")
    .insert([
      {
        user_id: userInfo.id,
        video_id: songInfo.value.id,
        title: songInfo.value.title,
        video_img: songInfo.value.url,
        recommend: selected.isRecommend,
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
        timestamp: JSON.stringify(lyricTimeStamp.value),
        spaceIndex: JSON.stringify(spaceIndex.value),
      },
    ]);

  buttonState({ text: "已新增", state: "isAdded", unclickable: true });
  removeLocal();
  loadingState(false);
  return;
}

onMounted(async () => {
  songInfo.value = JSON.parse(localStorage.getItem("songInfo"));
  initLyrics.value = JSON.parse(localStorage.getItem("initLyrics"));

  //防呆機制
  if (!route.query.song_id) {
    toSongState({ show: false, message: "此歌曲尚未建立" });
    return;
  }
  //若網址含使用者參數
  if (route.query.user) {
    if (route.query.user !== userInfo.user_metadata?.name) {
      toSongState({ show: false, message: "無法查看此歌曲" });
      return;
    }

    let { data, error } = await supabase
      .from("lyrics_content")
      .select()
      .eq("video_id", route.query.song_id)
      .eq("user_id", userInfo.id);

    let { data: list_data, error: list_error } = await supabase
      .from("lyrics_list")
      .select()
      .eq("video_id", route.query.song_id)
      .eq("user_id", userInfo.id);

    if (data.length === 0) {
      toSongState({ show: false, message: "查無此歌曲" });
      return;
    }

    lyrics.value = JSON.parse(data[0].hanji);
    resultLyrics.value = JSON.parse(data[0].hanji);
    hiraganaLyrics.value = JSON.parse(data[0].hiragana);
    romajiLyrics.value = JSON.parse(data[0].romaji);
    hiraLyrics.value = JSON.parse(data[0].hiragana);
    romaLyrics.value = JSON.parse(data[0].romaji);
    lyricTimeStamp.value = JSON.parse(data[0].timestamp);
    spaceIndex.value = JSON.parse(data[0].spaceIndex);
    selected.isRecommend.state = list_data[0].recommend.state;
    songInfo.value = list_data[0];
    
    buttonState({
      text: "確認修改",
      state: "update",
      unclickable: false,
    });
    return;
  }
  //是分享狀態
  if (route.query.recommend === "true") {
    isRecommendState.value = true;
    let { data, error } = await supabase
      .from("lyrics_content")
      .select()
      .eq("video_id", route.query.song_id);

    if (data.length === 0) {
      toSongState({ show: false, message: "查無此歌曲" });
      return;
    }

    lyrics.value = JSON.parse(data[0].hanji);
    hiraLyrics.value = JSON.parse(data[0].hiragana);
    romaLyrics.value = JSON.parse(data[0].romaji);
    lyricTimeStamp.value = JSON.parse(data[0].timestamp);
    spaceIndex.value = JSON.parse(data[0].spaceIndex);
    return;
  }

  //使用者為儲存歌曲，重整後可讀取自動存在 cookie 的資料
  if (route.query.song_id === songInfo.value?.id) {
    await tolyrics(initLyrics.value);
    lyrics.value = resultLyrics.value;
  }

  if (!resultLyrics.value.length) {
    toSongState({ show: false, message: "無法讀取歌詞，請稍後再嘗試" });
    return;
  }

  if (!isLoggedIn()) {
    buttonState({ text: "登入後方可儲存歌曲", state: "", unclickable: true });
    return;
  }

  lyrics.value = resultLyrics.value;
  hiraLyrics.value = hiraganaLyrics.value;
  romaLyrics.value = romajiLyrics.value;
});
</script>

<style>
.only-hanji rt {
  display: none;
}

.hiragana,
.romaji {
  display: none;
}

.plus-romaji .romaji {
  display: block;
}

.all-hiragana .hiragana {
  display: block;
}

.all-hiragana .init,
.all-hiragana .romaji {
  display: none;
}

.fixedVideo {
  position: sticky;
  top: 0px;
  z-index: 20;
}

.unclickable {
  --tw-bg-opacity: 1;
  cursor: not-allowed;
  background-color: rgb(71 85 105 / var(--tw-bg-opacity));
  color: darkgrey;
  font-weight: 900;
}
</style>
