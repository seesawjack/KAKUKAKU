<template>
  <div>
    <template v-if="!isYoutubeSearch">
      <label for="songName" class="flex items-center mb-3">
        <span class="w-full max-w-[9rem] text-left">歌曲名稱</span>
        <atmos-input id="songName" class="w-10/12 max-sm:text-sm ml-3" :inputTips="'請輸入歌曲名稱'"
          :inputClass="'w-full block py-3 pl-3 border rounded-lg bg-gray-900 border-gray-600 focus:border-blue-400 focus:ring-blue-300 focus:outline-none focus:ring focus:ring-opacity-40'"
          v-model.trim="songName" />
      </label>
      <label for="songUrl" class="flex items-center mb-3">
        <span class="w-full max-w-[9rem] text-left">Youtube 影片連結</span>
        <atmos-input id="songUrl" class="w-10/12 max-sm:text-sm ml-3" :inputTips="'請輸入 Youtube 影片連結'"
          :inputClass="'w-full block py-3 pl-3 border rounded-lg bg-gray-900 border-gray-600 focus:border-blue-400 focus:ring-blue-300 focus:outline-none focus:ring focus:ring-opacity-40'"
          v-model.trim="songUrl" />
      </label>
    </template>

    <atmos-edit :placeholder="'請輸入 / 貼上 / 上傳歌詞'" v-model.trim="lyrics" />
    <div class="flex">
      <button class="w-full bg-gray-900/50 border border-solid rounded-xl mr-2 hover:bg-slate-600" @click="sendLyric">
        確定
      </button>
      <label class="w-full bg-gray-900/50 border border-solid rounded-xl leading-10 hover:bg-slate-600 cursor-pointer"
        for="file-uploader">
        <input type="file" id="file-uploader" data-target="file-uploader" accept=".txt,.doc,.docx" class="hidden"
          @change="uploadFile" />
        上傳歌詞
      </label>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useLyricStore } from "../../stores/lyric";
import { useGlobalStore } from "../../stores/index";
import { useRegexStore } from "../../stores/regex";

import AtmosEdit from "../atmos/AtmosEdit.vue";
import AtmosInput from "../atmos/AtmosInput.vue";

const router = useRouter();
const route = useRoute();
const { tolyrics, selectedSong } = useLyricStore();
const { isError } = useGlobalStore();
const { songIdRegex } = useRegexStore();

const props = defineProps({
  isYoutubeSearch: {
    type: Boolean,
    required: true,
  },
});

const lyrics = ref("");
const songName = ref("");
const songUrl = ref("");
const songId = ref("");

//歌詞轉換成平假名
async function transformLyrics(lyric, id) {
  await tolyrics(lyric);
  router.push(`/song/item?song_id=${id}`);
}

//歌詞確定送出
function sendLyric() {
  //防呆機制
  if (!songName.value && !props.isYoutubeSearch) {
    isError({ showError: true, message: "請輸入歌曲名稱" });
    return;
  }
  if (!songUrl.value && !props.isYoutubeSearch) {
    isError({ showError: true, message: "請輸入 Youtube 影片連結" });
    return;
  }
  if (!lyrics.value) {
    isError({ showError: true, message: "請輸入 / 貼上 / 上傳歌詞" });
    return;
  }

  //根據從 youtube 搜尋或直接搜尋而進相對應行為
  if (props.isYoutubeSearch) {
    songId.value = route.query.song_id;
  } else {
    try {
      const youtubeUrl = new URL(songUrl.value);
      songId.value = songIdRegex(youtubeUrl.search);
      selectedSong({
        id: songId.value,
        title: songName.value,
        url: `https://i.ytimg.com/vi/${songId.value}/mqdefault.jpg`,
      });
    } catch (error) {
      isError({ showError: true, message: "連結有誤，請再次確認" });
      return;
    }
  }

  transformLyrics(lyrics.value, songId.value);
}

//上傳歌詞功能
async function uploadFile(e) {
  let file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.addEventListener(
    "load",
    (e) => {
      lyrics.value = e.target.result;
    },
    false
  );
  reader.readAsText(file);
}
</script>
