<template>
  <div class="max-w-[600px] mx-auto mt-5">
    <div v-if="loggedIn">
      <div v-if="songList.length" class="w-full">
        <p class="text-left mb-5">已建立歌曲 {{ songList.length }} 首</p>
        <atmos-card
          class="transition-all ml-2 mb-5 group cursor-pointer hover:bg-slate-300/[0.2]"
          v-for="item in songList"
          :key="item.id"
          :id="item.video_id"
          :url="item.video_img"
          :title="item.title"
          :href="`/song?song_id=${item.video_id}&user=${userInfo.user_metadata?.name}`"
          :isAdded="true"
        />
      </div>
      <atmos-not-found v-else tips="您尚未新增歌曲" />
    </div>
    <atmos-not-found v-else tips="登入後才能看到已建立歌詞頁" />
  </div>
</template>

<script setup>
import { ref, computed, reactive, onMounted } from "vue";
import { useGlobalStore } from "../../stores/index";
import { useAuthStore } from "../../stores/auth";
import useSupabase from "../../stores/supabase";

import AtmosCard from "../atmos/AtmosCard.vue";
import AtmosNotFound from "../atmos/AtmosNotFound.vue";

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
</script>


