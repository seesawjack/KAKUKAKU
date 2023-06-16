<template>
  <div>
    <template v-if="!isIdinUrl">
      <label for="songName" class="flex items-center mb-3">
        <span class="flex-none w-36 text-left">歌曲名稱</span>
        <atmos-input
          id="songName"
          class="ml-3 flex-initial w-10/12"
          :inputTips="'請輸入歌曲名稱'"
          :inputClass="'block w-full py-3 pl-3 border rounded-lg dark:bg-gray-900 dark:border-gray-600 focus:border-blue-400 dark:focus:border-blue-300 focus:ring-blue-300 focus:outline-none focus:ring focus:ring-opacity-40'"
          v-model.trim="songName"
        />
      </label>
      <label for="songUrl" class="flex items-center mb-3">
        <span class="flex-none w-36 text-left">Youtube 影片連結</span>
        <atmos-input
          id="songUrl"
          class="ml-3 flex-initial w-10/12"
          :inputTips="'請輸入 Youtube 影片連結'"
          :inputClass="'block w-full py-3 pl-3 border rounded-lg dark:bg-gray-900 dark:border-gray-600 focus:border-blue-400 dark:focus:border-blue-300 focus:ring-blue-300 focus:outline-none focus:ring focus:ring-opacity-40'"
          v-model.trim="songUrl"
        />
      </label>
    </template>

    <atmos-edit
      :placeholder="'請輸入 / 貼上 / 上傳歌詞'"
      v-model.trim="lyrics"
    />
    <div class="flex">
      <button
        class="flex-1 border border-solid rounded-xl mr-2 hover:bg-slate-600"
        @click="sendLyric"
      >
        確定
      </button>
      <label
        class="flex-1 border border-solid rounded-xl leading-10 hover:bg-slate-600 cursor-pointer"
        for="file-uploader"
      >
        <input
          type="file"
          id="file-uploader"
          data-target="file-uploader"
          accept=".txt,.doc,.docx"
          class="hidden"
          @change="uploadFile"
        />
        上傳歌詞
      </label>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed, toRefs } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useLyricStore } from "../../stores/lyric";
import { useGlobalStore } from "../../stores/index";
import { useRegexStore } from "../../stores/regex";
import AtmosEdit from "../atmos/AtmosEdit.vue";
import AtmosInput from "../atmos/AtmosInput.vue";

const router = useRouter();
const route = useRoute();
const { generateHiraganaLyrics, selectedSong } = useLyricStore();
const { isError } = useGlobalStore();
const { songIdRegex } = useRegexStore();

const props = defineProps({
  isIdinUrl: {
    type: Boolean,
    required: true,
  },
});

async function transformLyrics(lyric, id) {
  await generateHiraganaLyrics(lyric);
  router.push(`/song?song_id=${id}`);
}

const lyrics = ref("");
const songName = ref("");
const songUrl = ref("");
const songId = ref("");

//確定送出判斷
function sendLyric() {
  if (!songName.value && !props.isIdinUrl) {
    isError({ isError: true, message: "請輸入歌曲名稱" });
    return;
  }
  if (!songUrl.value && !props.isIdinUrl) {
    isError({ isError: true, message: "請輸入 Youtube 影片連結" });
    return;
  }
  if (!lyrics.value) {
    isError({ isError: true, message: "請輸入 / 貼上 / 上傳歌詞" });
    return;
  }

  if (props.isIdinUrl) {
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
      isError({ isError: true, message: "連結有誤，請再次確認" });
      return;
    }
  }

  transformLyrics(lyrics.value, songId.value);
}

//上傳歌詞
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

  if (file) {
    reader.readAsText(file);
  }
}
</script>
