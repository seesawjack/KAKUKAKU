<template>
  <div class="w-full max-w-[600px] max-sm:px-5 mx-auto mt-5">
    <div v-if="searchError.state !== 1">
      <div class="w-full">
        <form @submit.prevent="searchSongs">
          <atmos-input
            class="w-full max-sm:text-sm mb-5"
            :inputTips="'請輸入歌曲名稱'"
            :inputClass="'resize-none bg-[transparent] border border-solid rounded-3xl py-2 px-5 w-full outline-none'"
            v-model.trim="searchSongName"
          >
            <search-glasses
              class="absolute right-3 top-2"
              :class="hasSearchText"
              @click="searchSongs"
            />
          </atmos-input>
        </form>
        <p v-if="songList.length > 0" class="text-left mb-5">
          {{ searchedTips }}
        </p>
        <atmos-card
          class="max-sm:ml-0 ml-2 mb-5 group"
          :class="`dropdown-${item.video_id}`"
          v-for="item in songList"
          :key="item.id"
          :id="item.video_id"
          :url="item.video_img"
          :title="item.title"
          :href="`/song?song_id=${item.video_id}&recommend=true`"
          :isAdded="true"
          :disappear="deletedSong.indexOf(item.video_id) > -1"
        />
      </div>
    </div>
    <atmos-not-found v-if="searchError.state > 0" :tips="searchError.message" />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from "vue";
import { useGlobalStore } from "../../stores/index";
import { useAuthStore } from "../../stores/auth";
import useSupabase from "../../stores/supabase";

import AtmosCard from "../atmos/AtmosCard.vue";
import AtmosInput from "../atmos/AtmosInput.vue";
import AtmosNotFound from "../atmos/AtmosNotFound.vue";

import SearchGlasses from "../svg/SearchGlasses.vue";

const { userInfo } = useAuthStore();
const { loadingState } = useGlobalStore();
const { supabase } = useSupabase();

const songList = ref([]);
const searchSongName = ref("");
const deletedSong = ref([]);
const searchError = ref({ state: "", message: "" });
const isSearch = ref(false);

//輸入框左下方提示文字
const searchedTips = computed(() => {
  return isSearch.value
    ? `符合搜尋結果 ${songList.value.length} 首`
    : `已推薦 ${songList.value.length} 首`;
});
//搜尋結果錯誤訊息
function searchIsError({ state, message }) {
  searchError.value.state = state;
  searchError.value.message = message;
}
//搜尋歌曲
async function searchSongs() {
  isSearch.value = true;
  searchIsError({ state: 0, message: "" });

  loadingState(true);

  const { data, error } = await supabase
    .from("lyrics_list")
    .select()
    .eq("recommend->state", true)
    .ilike("title", `%${searchSongName.value}%`);

  if (data.length === 0) {
    searchIsError({ state: 2, message: "搜尋不到對應歌曲，請重新搜尋" });
  }

  songList.value = data;
  loadingState(false);
}

//根據搜尋框內是否含有效文字而顯示對應樣式
const hasSearchText = computed(() => {
  return searchSongName.value ? "cursor-pointer" : "opacity-40";
});


//頁面載入所有已建立歌曲
async function loadingLyricList() {
  loadingState(true);

  // const { data, error } = await supabase
  //   .from("lyrics_list")
  //   .select()
  //   .eq("recommend->state", true);

  const { data, error } = await supabase
    .from("lyrics_list")
    .select()
    .eq("recommend->state", true)
    .order('created_at',{ ascending: false });

  if (data?.length === 0) {
    searchIsError({
      state: 1,
      message: "目前無推薦歌曲清單",
    });
  }

  songList.value = data;

  loadingState(false);
}

onMounted(async () => {
  loadingLyricList();
});
</script>
