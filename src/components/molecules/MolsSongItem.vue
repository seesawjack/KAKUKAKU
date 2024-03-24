<template>
  <div v-if="songDisplay.show" class="w-full flex flex-col mx-auto">
    <atmos-video :id="songId" v-if="songId" />
    <atmos-lyric
      :furiganaLyrics="furiganaLyrics"
      :hiraganaLyrics="hiraganaLyrics"
      :romajiLyrics="romajiLyrics"
      class="relative"
    />
    <button
      v-if="btnState.visible"
      class="mt-3 border border-solid rounded-xl mr-2 hover:bg-slate-600"
      :class="{ unclickable: !btnState.clickable }"
      @click="handleSongSubmit"
    >
      {{ btnState.text }}
    </button>
  </div>
  <atmos-not-found v-else :tips="songDisplay.message" />
</template>

<script setup>
import { ref, reactive, onMounted, toRefs } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useAuthStore } from "../../stores/auth";
import { useLyricStore } from "../../stores/song";
import { useYoutubeStore } from "../../stores/youtube";
import { useRegex } from "../../composables/useRegex";
import { useSupabase } from "../../composables/useSupabase";
import Song from "@/utils/useSong.js"

import AtmosVideo from "../atmos/AtmosVideo.vue";
import AtmosLyric from "../atmos/AtmosLyric.vue";
import AtmosNotFound from "../atmos/AtmosNotFound.vue";

const route = useRoute();
const router = useRouter();

const songId = ref(route.query.song_id);

const { isLoggedIn, userInfo } = useAuthStore();

const {
  songPageOption: { selected },
  songDisplay,
  handleLyricTransform,
  removeLocal,
  handleSongState,
  handleSongDisplay,
} = useLyricStore();

const {
  initLyrics,
  furiganaLyrics,
  hiraganaLyrics,
  romajiLyrics,
  lyricTimeStamp,
  spaceIndex,
  songInfo,
} = toRefs(useLyricStore());

const {
  sbRequest,
  handleSongInfoAdd,
  handleSongContentAdd,
  handleSongRecommendUpdate,
  handleSongContentUpdate,
  handleVideoUpdate,
  getSongContent,
  getSongInfo,
} = useSupabase();

const { videoId } = toRefs(useYoutubeStore());
const { urlSongIdChangeRegex } = useRegex();
const songIdInSupabase = ref(null);
const songContentIdInSupabase = ref(null);

const songUploaded = ref(false); //歌曲是否新增/修改狀態
const btnState = reactive({
  text: "儲存建立",
  clickable: true,
  visible: true,
});

function handleBtnState({ text, click, visible }) {
  btnState.text = text;
  btnState.clickable = click;
  btnState.visible = visible;
}

//新增/修改歌曲
async function handleSongSubmit() {
  if (!btnState.clickable || !isLoggedIn() || !furiganaLyrics.value.length) {
    return;
  }

  if (songUploaded.value) {
    await sbRequest(handleSongRecommendUpdate, {
      isRecommend: selected.isRecommend,
      videoId: route.query.song_id,
      userId: userInfo.id,
    });

    await sbRequest(handleVideoUpdate, {
      id: songIdInSupabase.value,
      videoId: videoId.value,
      img: `https://i.ytimg.com/vi/${videoId.value}/mqdefault.jpg`,
      userId: userInfo.id,
    });

    await sbRequest(handleSongContentUpdate, {
      hiragana: hiraganaLyrics.value,
      romaji: romajiLyrics.value,
      furigana: furiganaLyrics.value,
      timestamp: lyricTimeStamp.value,
      spaceIndex: spaceIndex.value,
      videoId: videoId.value,
      id: songContentIdInSupabase.value,
      userId: userInfo.id,
    });

    const newPath = urlSongIdChangeRegex(route.fullPath, videoId.value);
    router.push(newPath);

    handleBtnState({
      text: "已修改",
      click: false,
      visible: true,
    });
  } else {
    selected.isRecommend.recommender = userInfo.user_metadata?.name;
    await sbRequest(handleSongInfoAdd, {
      userId: userInfo.id,
      videoId: videoId.value,
      title: songInfo.value.title,
      img: `https://i.ytimg.com/vi/${videoId.value}/mqdefault.jpg`,
      isRecommend: selected.isRecommend,
    });

    await sbRequest(handleSongContentAdd, {
      userId: userInfo.id,
      videoId: videoId.value,
      hiragana: hiraganaLyrics.value,
      romaji: romajiLyrics.value,
      furigana: furiganaLyrics.value,
      timestamp: lyricTimeStamp.value,
      spaceIndex: spaceIndex.value,
    });
    handleBtnState({ text: "已新增", click: false, visible: true });
    songUploaded.value = true;
    removeLocal();
    router.push(
      `/KAKUKAKU/song/item?song_id=${videoId.value}&user=${userInfo.user_metadata?.name}`
    );
  }
}

onMounted(async () => {
  songInfo.value = JSON.parse(localStorage.getItem("songInfo"));
  initLyrics.value = JSON.parse(localStorage.getItem("initLyrics"));

  //防呆機制
  if (!route.query.song_id) {
    handleSongDisplay({ show: false, message: "此歌曲尚未建立" });
    return;
  }

  //若網址含使用者參數
  if (route.query?.user && route.query?.user === userInfo.user_metadata?.name) {
    const { data: itemData } = await sbRequest(getSongInfo, {
      videoId: route.query.song_id,
      userId: userInfo.id,
    });

    if (itemData.length === 0) {
      handleSongDisplay({ show: false, message: "查無此歌曲" });
      return;
    }

    const { data: contentData } = await sbRequest(getSongContent, {
      videoId: route.query.song_id,
      userId: userInfo.id,
    });

    if (contentData.length === 0) {
      handleSongDisplay({ show: false, message: "查無此歌曲" });
      return;
    }

    handleSongState({
      furigana: contentData[0].furigana,
      hiragana: contentData[0].hiragana,
      romaji: contentData[0].romaji,
      timeStamp: contentData[0].timestamp,
      space: contentData[0].spaceIndex,
      recommend: itemData[0].recommend,
      info: itemData[0],
    });

    songIdInSupabase.value = itemData[0].id;
    songContentIdInSupabase.value = contentData[0].id;

    handleBtnState({
      text: "確認修改",
      click: true,
      visible: true,
    });
    songUploaded.value = true;

    return;
  }

  //是分享狀態
  if (route.query.recommend === "true") {
    const { data } = await sbRequest(getSongContent, {
      videoId: route.query.song_id,
    });

    if (data.length === 0) {
      handleSongDisplay({ show: false, message: "查無此歌曲" });
      return;
    }
    handleSongState({
      furigana: data[0].furigana,
      hiragana: data[0].hiragana,
      romaji: data[0].romaji,
      timeStamp: data[0].timestamp,
      space: data[0].spaceIndex,
    });
    handleBtnState({
      text: "",
      click: false,
      visible: false,
    });
    return;
  }

  //使用者未儲存歌曲，重整後可讀取自動存在 cookie 的資料
  if (route.query.song_id === songInfo.value?.id) {
    await handleLyricTransform(initLyrics.value);
  }

  if (!furiganaLyrics.value.length) {
    handleSongDisplay({ show: false, message: "無法讀取歌詞，請稍後再嘗試" });
    return;
  }

  if (!isLoggedIn()) {
    handleBtnState({
      text: "登入後方可儲存歌曲",
      click: false,
      visible: true,
    });
  }
});
</script>

<style>
.only-kanji rt {
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
