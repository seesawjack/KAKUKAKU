<template>
  <div class="max-w-[600px] mx-auto mt-5">
    <p class="text-left mb-5">已建立歌曲 {{lyricsInfo.length}} 首</p>
      <atmos-card
        class="transition-all ml-2 mb-5 group cursor-pointer hover:bg-slate-300/[0.2]"
        v-for="item in lyricsInfo"
        :key="item.id"
        :id="item.video_id"
        :url="item.video_img"
        :title="item.title"
        :href="`/song?video=${item.video_id}&user=${userInfo.user_metadata?.name}`"
      />
  </div>
</template>

<script setup>
import { ref, toRefs, reactive, onMounted } from "vue";
import useSupabase from "../../stores/supabase";
import { useGlobalStore } from "../../stores/index";
import { useAuthStore } from "../../stores/auth";
import AtmosCard from "../atmos/AtmosCard.vue";

const { userInfo } = toRefs(useAuthStore());
const { isLoading } = toRefs(useGlobalStore());
const { supabase } = useSupabase();
const lyricsInfo = ref([]);

onMounted(async () => {
  isLoading.value = true;
  let { data, error } = await supabase.from("lyrics_list").select();
  lyricsInfo.value = data;
  isLoading.value = false;
});
</script>
