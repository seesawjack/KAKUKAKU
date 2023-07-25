<template>
  <div class="w-full max-w-[600px] max-sm:px-5 mx-auto mt-5">
    <div v-if="loggedIn">
      <div v-if="songList.length" class="w-full">
        <form @submit.prevent="searchSongs">
          <atmos-input class="w-full max-sm:text-sm mb-5" :inputTips="'請輸入想搜尋的已建立歌曲名稱'"
            :inputClass="'resize-none bg-[transparent] border border-solid rounded-3xl py-2 px-5 w-full outline-none'"
            v-model.trim="searchSongName">
            <search-glasses class="absolute right-3 top-2"
            :class="hasSearchText" @click="searchSongs" />
          </atmos-input>
        </form>
        <p class="text-left mb-5">已建立歌曲 {{ songList.length }} 首</p>
        <atmos-card class="max-sm:ml-0 ml-2 mb-5 group" :class="`dropdown-${item.video_id}`" v-for="item in songList"
          :key="item.id" :id="item.video_id" :url="item.video_img" :title="item.title"
          :href="`/song?song_id=${item.video_id}&user=${userInfo.user_metadata?.name}`" :isAdded="true"
          :disappear="deletedSong.indexOf(item.video_id) > -1">
          <template #configure>
            <div class="w-[22.5px] relative">
              <more-icon @click="showDropDown(item.video_id)" class="hidden group-hover:block cursor-pointer max-md:block"
                :class="[
                  { '!block': clickClassName === item.video_id },
                  { 'group-hover': !deletedSong },
                ]" />
              <atmos-drop-down class="top-4 right-3 py-1 px-2" :show="clickClassName === item.video_id">
                <button class="w-full py-1 rounded-md hover:bg-slate-800" @click="deleteSong(item.video_id)">
                  刪除此歌曲
                </button>
              </atmos-drop-down>
            </div>
          </template>
        </atmos-card>
      </div>
      <atmos-not-found v-else tips="您尚未新增歌曲" />
    </div>
    <atmos-not-found v-else tips="登入後才能看到已建立歌詞清單" />
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
import AtmosDropDown from "../atmos/AtmosDropDown.vue";
import MoreIcon from "../svg/MoreIcon.vue";
import SearchGlasses from "../svg/SearchGlasses.vue";

const { userInfo, isLoggedIn } = useAuthStore();
const { loadingState } = useGlobalStore();
const { supabase } = useSupabase();

const songList = ref([]);
const loggedIn = computed(() => isLoggedIn());
const searchSongName = ref('');
const deletedSong = ref([]);

//搜尋歌曲
async function searchSongs() {
  if (!isLoggedIn()) return;
  loadingState(true);

  const { data, error } = await supabase
    .from("lyrics_list")
    .select()
    .eq("user_id", userInfo.id)
    .ilike("title", `%${searchSongName.value}%`);

  songList.value = data;

  loadingState(false);
}

//根據搜尋框內是否含有效文字而顯示對應樣式
const hasSearchText = computed(() => {
  return searchSongName.value ? 'cursor-pointer' : 'opacity-40';
});
//刪除歌曲
async function deleteSong(id) {
  loadingState(true);

  deletedSong.value.push(id);
  songList.value = songList.value.filter((song) => song.video_id !== id);

  //歌曲清單刪除該歌曲
  const { data, error } = await supabase
    .from("lyrics_list")
    .delete()
    .eq("video_id", id);

  //歌詞內容清單刪除該歌曲的歌詞 
  const { data: contentData, error: contentError } = await supabase
    .from("lyrics_content")
    .delete()
    .eq("video_id", id);

  loadingState(false);
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
}

//頁面載入所有已建立歌曲
async function loadingLyricList() {
  if (!isLoggedIn()) return;
  loadingState(true);

  const { data, error } = await supabase
    .from("lyrics_list")
    .select()
    .eq("user_id", userInfo.id);

  songList.value = data;

  loadingState(false);
}

onMounted(async () => {
  document.addEventListener("click", notClickDropdwonSelf);
  loadingLyricList();

});

onUnmounted(() => {
  document.body.removeEventListener("click", notClickDropdwonSelf);
});
</script>

