<template>
  <div class="max-sm:px-5 max-w-[600px] w-full mx-auto mt-5">
    <div v-if="loggedIn">
      <div v-if="songList.length" class="w-full">
        <p class="text-left mb-5">已建立歌曲 {{ songList.length }} 首</p>
        <atmos-card
          class="max-sm:ml-0 ml-2 mb-5 group"
          :class="`dropdown-${item.video_id}`"
          v-for="item in songList"
          :key="item.id"
          :id="item.video_id"
          :url="item.video_img"
          :title="item.title"
          :href="`/song?song_id=${item.video_id}&user=${userInfo.user_metadata?.name}`"
          :isAdded="true"
          :disappear="disappear.indexOf(item.video_id) > -1"
        >
          <template #configure>
            <div class="w-[22.5px] relative">
              <more-icon
                @click="showDropDown(item.video_id)"
                class="hidden group-hover:block cursor-pointer"
                :class="[
                  { '!block': clickClassName === item.video_id },
                  { 'group-hover': !disappear },
                ]"
              />
              <atmos-drop-down
                class="top-4 right-3 py-1 px-2"
                :show="clickClassName === item.video_id"
              >
                <button
                  class="w-full py-1 rounded-md hover:bg-slate-800"
                  @click="deleteSong(item.video_id)"
                >
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
import { ref, computed, onMounted, onBeforeUnmount } from "vue";
import { useGlobalStore } from "../../stores/index";
import { useAuthStore } from "../../stores/auth";
import useSupabase from "../../stores/supabase";

import AtmosCard from "../atmos/AtmosCard.vue";
import AtmosNotFound from "../atmos/AtmosNotFound.vue";
import MoreIcon from "../svg/MoreIcon.vue";
import AtmosDropDown from "../atmos/AtmosDropDown.vue";

const { userInfo, isLoggedIn } = useAuthStore();
const { loadingState } = useGlobalStore();
const { supabase } = useSupabase();

const songList = ref([]);
const loggedIn = computed(() => isLoggedIn());

onMounted(async () => {
  if (!isLoggedIn()) {
    return;
  }
  loadingState(true);
  const { data, error } = await supabase
    .from("lyrics_list")
    .select()
    .eq("user_id", userInfo.id);

  songList.value = data;
  loadingState(false);
});

const disappear = ref([]);
async function deleteSong(id) {
  loadingState(true);
  disappear.value.push(id);
  songList.value = songList.value.filter((song) => song.video_id !== id);
  
  const { data, error } = await supabase
    .from("lyrics_list")
    .delete()
    .eq("video_id", id);

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
onMounted(() => {
  document.addEventListener("click", () => {
    if (!event.target.closest(`.dropdown-${clickClassName.value}`)) {
      clickClassName.value = "";
    }
  });
});

onBeforeUnmount(() => {
  document.body.removeEventListener("click", () => {
    if (!event.target.closest(`.dropdown-${clickClassName.value}`)) {
      clickClassName.value = "";
    }
  });
});
</script>

<style scoped>
.disappear {
  opacity: 0;
}
</style>

