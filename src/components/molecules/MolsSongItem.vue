<template>
  <div v-if="songState.show" class="w-full flex flex-col mx-auto">
    <atmos-video :id="songId" v-if="songId" :class="isfixedVideo" />
    <atmos-lyric
      :lyrics="resultLyrics"
      :hiraganaLyrics="hiraganaLyrics"
      :romajiLyrics="romajiLyrics"
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
import { useLyricStore } from "../../stores/song";
import { useGlobalStore } from "../../stores";
import { useRequestStore } from "../../stores/request";
import { useApiStore } from "../../stores/api";

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

const { loadingState } = useGlobalStore();
const { supabaseRequest } = useRequestStore();
const {
  handleSongInfoAdd,
  handleSongContentAdd,
  handleSongRecommendUpdate,
  handleSongContentUpdate,
  getSongContent,
  getSongInfo,
} = useApiStore();

const lyrics = ref([]);

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

  if (confirmButton.state === "update") {
    await supabaseRequest(handleSongRecommendUpdate, {
      isRecommend: selected.isRecommend,
      videoId: route.query.song_id,
      userId: userInfo.id,
    });

    await supabaseRequest(handleSongContentUpdate, {
      hiragana: hiraganaLyrics.value,
      romaji: romajiLyrics.value,
      hanji: resultLyrics.value,
      timestamp: lyricTimeStamp.value,
      spaceIndex: spaceIndex.value,
      videoId: route.query.song_id,
      userId: userInfo.id,
    });

    buttonState({
      text: "已修改",
      state: "isAdded",
      unclickable: true,
    });

    removeLocal();
    return;
  }

  await supabaseRequest(handleSongInfoAdd, {
    userId: userInfo.id,
    videoId: songInfo.value.id,
    title: songInfo.value.title,
    img: songInfo.value.url,
    isRecommend: selected.isRecommend,
  });

  await supabaseRequest(handleSongContentAdd, {
    userId: userInfo.id,
    videoId: songInfo.value.id,
    hiragana: hiraganaLyrics.value,
    romaji: romajiLyrics.value,
    hanji: resultLyrics.value,
    timestamp: lyricTimeStamp.value,
    spaceIndex: spaceIndex.value,
  });
  buttonState({ text: "已新增", state: "isAdded", unclickable: true });
  removeLocal();
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
    const { data: contentData } = await supabaseRequest(getSongContent, {
      videoId: route.query.song_id,
      userId: userInfo.id,
    });
    const { data: itemData } = await supabaseRequest(getSongInfo, {
      videoId: route.query.song_id,
      userId: userInfo.id,
    });

    if (contentData.length === 0) {
      toSongState({ show: false, message: "查無此歌曲" });
      return;
    }

    resultLyrics.value = contentData[0].hanji;
    hiraganaLyrics.value = contentData[0].hiragana;
    romajiLyrics.value = contentData[0].romaji;
    lyricTimeStamp.value = contentData[0].timestamp;
    spaceIndex.value = contentData[0].spaceIndex;

    selected.isRecommend.state = itemData[0].recommend.state;
    songInfo.value = itemData[0];

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
    const { data: itemData } = await supabaseRequest(getSongInfo, {
      videoId: route.query.song_id,
    });
    if (!itemData.length) {
      toSongState({ show: false, message: "此歌曲不在推薦清單中" });
      return;
    }
    const { data } = await supabaseRequest(getSongContent, {
      videoId: route.query.song_id,
    });

    if (data.length === 0) {
      toSongState({ show: false, message: "查無此歌曲" });
      return;
    }
    resultLyrics.value = JSON.parse(data[0].hanji);
    hiraganaLyrics.value = JSON.parse(data[0].hiragana);
    romajiLyrics.value = JSON.parse(data[0].romaji);
    lyricTimeStamp.value = JSON.parse(data[0].timestamp);
    spaceIndex.value = JSON.parse(data[0].spaceIndex);
    return;
  }

  //使用者未儲存歌曲，重整後可讀取自動存在 cookie 的資料
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
