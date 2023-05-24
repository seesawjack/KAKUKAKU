<template>
  <div
    class="w-[640px] h-[56px] overflow-hidden mb-5 mx-auto"
    :class="className"
  >
    <slot></slot>
  </div>
  <form @submit.prevent="searchSongs">
    <atmos-input
      :inputTips="'請輸入歌曲名稱'"
      :inputClass="'resize-none bg-[transparent] border border-solid rounded-3xl py-2 px-5 w-full'"
      v-model="songInfo"
    >
      <search-glasses
        class="absolute right-3 top-2"
        :class="{ 'opacity-40': !iconOpacity, 'cursor-pointer': iconOpacity }"
        @click="searchSongs"
      />
    </atmos-input>
  </form>
</template>

<script setup>
import { ref,computed } from "vue";
import AtmosInput from "../atmos/AtmosInput.vue";
import SearchGlasses from "../svg/SearchGlasses.vue";
import { useSearchStore } from "../../stores/search/index";

const props = defineProps({
  className: {
    type: String,
    required: true,
  },
});

const songInfo = ref('')
const emit = defineEmits(["search"]);
const { youtubeSearch } = useSearchStore();

async function searchSongs(value) {
  if (!songInfo.value) return;
  const data = await youtubeSearch(songInfo.value);
  emit("search", data);
}

const iconOpacity = computed(()=>{
  return songInfo.value ? true : false
});

</script>

<style scoped>
.disappear {
  height: 0px;
  margin: 0px;
  transition: 0.5s;
}
</style>
