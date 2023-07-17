<template>
  <div
    class="w-[640px] h-[56px] overflow-hidden mb-5 mx-auto"
    :class="className"
  >
    <slot></slot>
  </div>
  <form @submit.prevent="searchSongs">
    <atmos-input
      class="max-w-xl mx-auto"
      :inputTips="'請輸入想搜尋的歌曲名稱'"
      :inputClass="'resize-none bg-[transparent] border border-solid rounded-3xl py-2 px-5 w-full'"
      v-model="searchResult"
    >
      <search-glasses
        class="absolute right-3 top-2"
        :class="{ 'opacity-40': !isOpacity, 'cursor-pointer': isOpacity }"
        @click="searchSongs"
      />
    </atmos-input>
  </form>
</template>

<script setup>
import { ref, computed } from "vue";
import AtmosInput from "../atmos/AtmosInput.vue";
import SearchGlasses from "../svg/SearchGlasses.vue";
import { useSearchStore } from "../../stores/search/index";
import { useGlobalStore } from "../../stores/index";

const props = defineProps({
  className: {
    type: String,
    required: true,
  },
});
const { isError,loadingState } = useGlobalStore(); 

const searchResult = ref("");
const emit = defineEmits(["search"]);
const { youtubeSearch } = useSearchStore();

async function searchSongs(value) {
  if (!searchResult.value){
    isError({isError:true,message:'請輸入歌曲名稱'});
    return;
  }
  loadingState(true);
  const data = await youtubeSearch(searchResult.value);
  emit("search", data);
  loadingState(false);
}

const isOpacity = computed(() => {
  return searchResult.value ? true : false;
});
</script>

<style scoped>
.disappear {
  height: 0px;
  margin: 0px;
  transition: 0.5s;
}
</style>
