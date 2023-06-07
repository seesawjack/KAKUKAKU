<template>
  <div class="max-w-[600px] mx-auto mt-5">
    <div v-if="loggedIn">
      <div v-if="lyricsInfo.length" class="w-full">
        <p class="text-left mb-5">已建立歌曲 {{ lyricsInfo.length }} 首</p>
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
      <div
        v-else
        class="w-full left-50 top-60 mt-32 px-16 pt-9 pb-14 rounded-lg bg-gray-600/40"
      >
        <img
          src="/src/assets/images/forbidden.png"
          alt="您尚未建立歌曲"
          width="100"
          class="mx-auto mb-3 cursor-pointer transition-all"
          :class="catStyle"
          @click="catSound"
        />
        <p>您尚未建立歌曲</p>
      </div>
    </div>
    <div
      v-else
      class="left-50 top-60 mt-32 px-16 pt-9 pb-14 rounded-lg bg-gray-600/40"
    >
      <img
        src="/src/assets/images/forbidden.png"
        alt="登入後才可以看到已建立歌曲"
        width="100"
        class="mx-auto mb-3 cursor-pointer transition-all"
        :class="catStyle"
        @click="catSound"
      />
      <p>登入後才可以看到已建立歌曲</p>
    </div>
  </div>
</template>

<script setup>
import {
  ref,
  toRefs,
  computed,
  reactive,
  onMounted,
  onBeforeUnmount,
} from "vue";
import useSupabase from "../../stores/supabase";
import { useGlobalStore } from "../../stores/index";
import { useAuthStore } from "../../stores/auth";
import AtmosCard from "../atmos/AtmosCard.vue";

const { userInfo, isLoggedIn } = useAuthStore();
const { isLoading } = toRefs(useGlobalStore());
const { supabase } = useSupabase();
const lyricsInfo = ref([]);

const loggedIn = computed(() => isLoggedIn());

const catStyle = reactive({
  move: false,
});

let timer;
function catSound() {
  const audio = new Audio("/src/assets/sound/cat_meow.mp3");
  audio.play();
  catStyle.move = true;

  timer = setTimeout(() => {
    catStyle.move = false;
  }, 1000);
}

onMounted(async () => {
  if (!isLoggedIn()) {
    return;
  }
  isLoading.value = true;
  let { data, error } = await supabase
    .from("lyrics_list")
    .select()
    .eq("user_id", userInfo.id);
  lyricsInfo.value = data;
  isLoading.value = false;
});

onBeforeUnmount(() => clearTimeout(timer));
</script>

<style scoped>
.move {
  animation: catmove 0.3s linear infinite;
}

@keyframes catmove {
  0% {
    transform: translateX(0px);
  }
  25% {
    transform: translateX(-3px);
  }
  50% {
    transform: translateX(3px);
  }
  75% {
    transform: translateX(-5px);
  }
  100% {
    transform: translateX(0px);
  }
}
</style>
