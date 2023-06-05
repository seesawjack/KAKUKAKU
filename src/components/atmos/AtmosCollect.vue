<template>
  <like-button
    v-if="path === 'song'"
    class="mx-3 cursor-pointer"
    :class="{ collect: isCollect }"
    @click="collectLyric"
  />
</template>

<script setup>
import { ref, computed, toRefs } from "vue";
import { storeToRefs } from "pinia";
import { useRoute } from "vue-router";
import { useAuthStore } from "../../stores/auth";
import { useGlobalStore } from "../../stores/index";
import { useLyricStore } from "../../stores/lyric";
import LikeButton from "../svg/LikeButton.vue";
import useSupabase from "../../stores/supabase";

const { isLoggedIn } = useAuthStore();
const { isError } = useGlobalStore();
let { isLoading } = toRefs(useGlobalStore());
const { supabase } = useSupabase();
const { hiraganaLyrics } = storeToRefs(useLyricStore());

const route = useRoute();
const path = computed(() => route.path.replace("/", ""));

const isCollect = ref(false);

async function collectLyric() {
  if (!isLoggedIn()) {
    isError({ isError: true, message: "會員登入後方可使用收藏功能" });
    return;
  }
  if (!hiraganaLyrics.value.length) {
    isError({ isError: true, message: "產生歌詞後方可使用收藏功能" });
    return;
  }
  isLoading.value = true;
  const { data, error } = await supabase.from("lyrics").insert([
    {
      lyrics: JSON.stringify(hiraganaLyrics.value),
      lyric_name: "Red:birthMark",
      user_id: "123",
    },
  ]);
  isCollect.value = !isCollect.value;
  isLoading.value = false;
}
</script>

<style scoped>
.collect {
  stroke: none;
  fill: #ecd355;
}
</style>