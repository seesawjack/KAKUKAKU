<template>
  <div class="w-full max-w-[600px] max-sm:px-5 mx-auto">
    <div v-if="pageIsPersonal && searchError.state !== 1">
      <div class="w-full">
        <form @submit.prevent="searchSongs">
          <atmos-input class="w-full max-sm:text-sm mb-5" :inputTips="'請輸入歌曲名稱'"
            :inputClass="'resize-none bg-[transparent] border border-solid rounded-3xl py-2 px-5 w-full outline-none'"
            v-model.trim="searchSongName">
            <atmos-svg-icon name="icon_search" class="absolute right-3 top-2" :class="hasSearchText"
              @click="searchSongs" />
          </atmos-input>
        </form>
        <p v-if="songList?.length > 0" class="text-left mb-5">
          {{ searchedTips }}
        </p>
        <atmos-card class="max-sm:ml-0 ml-2 mb-5 group" :class="`dropdown-${item.video_id}`" v-for="item in songList"
          :key="item.id" :id="item.video_id" :url="item.video_img" :title="item.title" :href="`/KAKUKAKU/song/item?song_id=${item.video_id}&${route.path.indexOf('personal') > 0
            ? 'user=' + userInfo.user_metadata?.name
            : 'recommend=true'
            }`" :isAdded="true" :disappear="deletedSong.indexOf(item.video_id) > -1">
          <template #configure v-if="route.path.indexOf('personal') > 0">
            <div class="w-[22.5px] relative">
              <atmos-svg-icon name="icon_more" @click="showDropDown(item.video_id)"
                class="hidden group-hover:block cursor-pointer max-md:block" :class="[
                  { '!block': clickClassName === item.video_id },
                  { 'group-hover': !deletedSong },
                ]" />
              <atmos-drop-down class="top-4 right-3 py-1 px-2" :show="clickClassName === item.video_id">
                <button class="w-full py-1 rounded-md hover:bg-slate-800" @click="toDeleteSong(item.video_id)">
                  刪除此歌曲
                </button>
              </atmos-drop-down>
            </div>
          </template>
        </atmos-card>
        <atmos-pagination v-if="totalSongCount > 10" :nowPage="page + 1" :totalPages="totalPages" @search="pageChagne" />
      </div>
    </div>
    <atmos-not-found v-if="searchError.state > 0" :tips="searchError.message" />
  </div>
</template>

<script setup>
import { ref, watch, computed, onMounted, onUnmounted } from "vue";
import { useRoute } from "vue-router";
import { useGlobalStore } from "../../stores/index";
import { useAuthStore } from "../../stores/auth";
import { useLyricStore } from "../../stores/song";
import { useRequestStore } from "../../stores/request";
import { useApiStore } from "../../stores/api";

import AtmosCard from "../atmos/AtmosCard.vue";
import AtmosInput from "../atmos/AtmosInput.vue";
import AtmosNotFound from "../atmos/AtmosNotFound.vue";
import AtmosDropDown from "../atmos/AtmosDropDown.vue";
import AtmosPagination from "../atmos/AtmosPagination.vue";
import AtmosSvgIcon from "../atmos/AtmosSvgIcon.vue";

const route = useRoute();

const { userInfo, isLoggedIn } = useAuthStore();
const { loadingState } = useGlobalStore();
const {
  songPageOption: { selected },
} = useLyricStore();
const { supabaseRequest } = useRequestStore();
const {
  getSearchedSongList,
  getSearchedRecomSongList,
  deleteSong,
  deleteSongContent,
  handlePageChange,
  handleRecoPageChange,
  getSongList,
  getRecoSongList,
} = useApiStore();

const songList = ref([]);
const searchSongName = ref("");
const deletedSong = ref([]);
const searchError = ref({ state: "", message: "" });
const isSearch = ref(false);

//輸入框左下方提示文字
const searchedTips = computed(() => {
  return isSearch.value
    ? `符合搜尋結果 ${totalSongCount.value} 首`
    : `已${route.path.indexOf("personal") > 0 ? '建立' : '推薦'} ${totalSongCount.value} 首`;
});

//搜尋結果錯誤訊息
function searchIsError({ state, message }) {
  searchError.value.state = state;
  searchError.value.message = message;
}
//搜尋歌曲
async function searchSongs() {
  let songData = {};
  page.value = 0;
  isSearch.value = true;
  searchIsError({ state: 0, message: "" });

  if (!pageIsPersonal) return;
  if (route.path.indexOf("personal") > 0) {
    const { data, count } = await supabaseRequest(getSearchedSongList, {
      userId: userInfo.id,
      name: searchSongName.value,
    });

    songData.data = data;
    songData.count = count;
  } else if (route.path.indexOf("recommend") > 0) {
    const { data, count } = await supabaseRequest(getSearchedRecomSongList, {
      name: searchSongName.value,
    });

    songData.data = data;
    songData.count = count;
  }

  if (songData.data.length === 0) {
    searchIsError({ state: 2, message: "搜尋不到對應歌曲，請重新搜尋" });
  }

  songList.value = songData.data;
  totalPages.value = Math.ceil(songData.count / 10);
  totalSongCount.value = songData.count;
}

//頁面判斷提示
const pageIsPersonal = computed(() => {
  if (route.path.indexOf("recommend") > 0) {
    return true;
  } else if (route.path.indexOf("personal") > 0 && isLoggedIn()) {
    return true;
  } else {
    searchIsError({ state: 3, message: "登入會員後方可看到已建立歌曲清單" });
    return false;
  }
});

//根據搜尋框內是否含有效文字而顯示對應樣式
const hasSearchText = computed(() => {
  return searchSongName.value ? "cursor-pointer" : "opacity-40";
});

//刪除歌曲
async function toDeleteSong(id) {
  totalSongCount.value--;
  deletedSong.value.push(id);
  songList.value = songList.value.filter((song) => song.video_id !== id);

  //歌曲清單刪除該歌曲
  await supabaseRequest(deleteSong, { videoId: id });

  //歌詞內容清單刪除該歌曲的歌詞
  await supabaseRequest(deleteSongContent, { videoId: id });
}

const clickClassName = ref("");

function showDropDown(id) {
  clickClassName.value = clickClassName.value === id ? "" : id;
}

//在顯示刪除歌詞的狀態下按網頁中其他位置，會取消顯示刪除歌詞的狀態
const notClickDropdwonSelf = () => {
  if (!event.target.closest(`.dropdown-${clickClassName.value}`)) {
    clickClassName.value = "";
  }
};

//分頁
const getPagination = (page, size) => {
  const limit = size ? +size : 3;
  const from = page ? page * limit : 0;
  const to = page ? from + size - 1 : size - 1;

  return { from, to };
};

const page = ref(0);
async function pageChagne(value) {
  let songData = {};
  page.value += value ? 1 : -1;

  const { from, to } = getPagination(page.value, 10);

  if (route.path.indexOf("personal") > 0) {
    const { data } = await supabaseRequest(handlePageChange, {
      userId: userInfo.id,
      from: from,
      to: to,
    });

    songData.data = data;
  } else if (route.path.indexOf("recommend") > 0) {
    const { data } = await supabaseRequest(handleRecoPageChange, {
      from: from,
      to: to,
    });
    songData.data = data;
  }

  songList.value = songData.data;
}
const totalSongCount = ref(0);
const totalPages = ref(0);

//初始化資料
function pageDataInit() {
  isSearch.value = false;
  searchSongName.value = "";
}

//頁面載入所有已建立歌曲
async function loadingLyricList() {
  let songData = {};
  loadingState(true);
  if (isLoggedIn() && route.path.indexOf("personal") > 0) {
    searchIsError({ state: 0, message: "" });
    const { data, count } = await supabaseRequest(getSongList, {
      userId: userInfo.id,
    });
    songData.data = data;
    songData.count = count;
  } else if (route.path.indexOf("recommend") > 0) {
    searchIsError({ state: 0, message: "" });
    const { data, count } = await supabaseRequest(getRecoSongList);
    songData.data = data;
    songData.count = count;
  }

  if (songData.data?.length === 0) {
    if (route.path.indexOf("personal") > 0) {
      searchIsError({
        state: 1,
        message: "您尚未新增歌曲",
      });
    } else {
      searchIsError({
        state: 1,
        message: "目前無會員提供推薦歌曲",
      });
    }
  }
  songList.value = songData.data;
  totalPages.value = Math.ceil(songData.count / 10);
  totalSongCount.value = songData.count;
  loadingState(false);
}

watch(
  () => route.path,
  () => {
    if (route.path.indexOf("personal") || route.path.indexOf("recommend")) {
      pageDataInit();
      loadingLyricList();
    }
  }
);

onMounted(async () => {
  document.addEventListener("click", notClickDropdwonSelf);
  loadingLyricList();
});

onUnmounted(() => {
  document.body.removeEventListener("click", notClickDropdwonSelf);
});
</script>
