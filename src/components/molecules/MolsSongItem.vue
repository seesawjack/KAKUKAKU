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
      :class="{ 'unclickable': !btnState.clickable }"
      @click="handleSongSubmit"
    >
      {{ btnState.text }}
    </button>
  </div>
  <atmos-not-found v-else :tips="songDisplay.message" />
</template>

<script setup>
import { ref, reactive, onMounted, toRefs } from "vue";
import { useRoute } from "vue-router";
import { useAuthStore } from "../../stores/auth";
import { useLyricStore } from "../../stores/song";
import { useRequestStore } from "../../stores/request";
import { useApiStore } from "../../stores/api";

import AtmosVideo from "../atmos/AtmosVideo.vue";
import AtmosLyric from "../atmos/AtmosLyric.vue";
import AtmosNotFound from "../atmos/AtmosNotFound.vue";

const route = useRoute();

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

const { supabaseRequest } = useRequestStore();
const {
  handleSongInfoAdd,
  handleSongContentAdd,
  handleSongRecommendUpdate,
  handleSongContentUpdate,
  getSongContent,
  getSongInfo,
} = useApiStore();

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

//新增歌曲
async function handleSongSubmit() {
  if (!btnState.clickable || !isLoggedIn() || !furiganaLyrics.value.length) {
    return;
  }

  if (songUploaded.value) {
    await supabaseRequest(handleSongRecommendUpdate, {
      isRecommend: selected.isRecommend,
      videoId: route.query.song_id,
      userId: userInfo.id,
    });

    await supabaseRequest(handleSongContentUpdate, {
      hiragana: hiraganaLyrics.value,
      romaji: romajiLyrics.value,
      furigana: furiganaLyrics.value,
      timestamp: lyricTimeStamp.value,
      spaceIndex: spaceIndex.value,
      videoId: route.query.song_id,
      userId: userInfo.id,
    });

    handleBtnState({
      text: "已修改",
      click: false,
      visible: true,
    });
  } else {
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
      furigana: furiganaLyrics.value,
      timestamp: lyricTimeStamp.value,
      spaceIndex: spaceIndex.value,
    });
    handleBtnState({ text: "已新增", click: false, visible: true });
    removeLocal();
    songUploaded.value = true;
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
  if (route.query?.user === userInfo.user_metadata?.name) {
    // if (route.query.user !== userInfo.user_metadata?.name) {
    //   handleSongDisplay({ show: false, message: "無法查看此歌曲" });
    //   return;
    // }

    const { data: itemData } = await supabaseRequest(getSongInfo, {
      videoId: route.query.song_id,
      userId: userInfo.id,
    });

    if (itemData.length === 0) {
      handleSongDisplay({ show: false, message: "查無此歌曲" });
      return;
    }

    const { data: contentData } = await supabaseRequest(getSongContent, {
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
      recommend: itemData[0].recommend.state,
      info: itemData[0],
    });

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
    const { data: itemData } = await supabaseRequest(getSongInfo, {
      videoId: route.query.song_id,
    });

    if (!itemData.length) {
      handleSongDisplay({ show: false, message: "此歌曲不在推薦清單中" });
      return;
    }
    const { data } = await supabaseRequest(getSongContent, {
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
