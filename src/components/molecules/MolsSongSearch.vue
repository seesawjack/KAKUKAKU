<template>
  <div class="w-full overflow-hidden max-sm:mb-2 mb-3 mx-auto" :class="className">
    <slot></slot>
  </div>
  <form @submit.prevent="searchSongs">
    <atmos-input class="max-sm:max-w-xs max-sm:text-sm max-w-xl mx-auto" :inputTips="'請輸入想搜尋的歌曲名稱'"
      :inputClass="'resize-none bg-[transparent] border border-solid rounded-3xl py-2 px-5 w-full outline-none'"
      v-model="searchResult">
      <atmos-svg-icon name="icon_search" class="absolute right-3 top-2" :class="hasSearchText" @click="searchSongs" />
    </atmos-input>
  </form>
</template>

<script setup>
import { ref, computed } from "vue";
import { useYoutubeStore } from "../../stores/youtube";
import { useGlobalStore } from "../../stores/index";

import AtmosInput from "../atmos/AtmosInput.vue";
import AtmosSvgIcon from "../atmos/AtmosSvgIcon.vue";

const props = defineProps({
  className: {
    type: String,
    required: true,
  },
});

const emit = defineEmits(["search"]);

const { isError, loadingState } = useGlobalStore();
const { youtubeSearch } = useYoutubeStore();

//判斷搜尋框是否含有資料(含 loading 及錯誤訊息顯示)
const searchResult = ref("");
async function searchSongs(value) {
  if (!searchResult.value) {
    isError({ showError: true, message: '請輸入歌曲名稱' });
    return;
  }
  loadingState(true);
  const data = await youtubeSearch(searchResult.value);
  emit("search", data);
  loadingState(false);
}

//根據搜尋框內是否含有效文字而顯示對應樣式
const hasSearchText = computed(() => {
  return searchResult.value ? 'cursor-pointer' : 'opacity-40';
});
</script>

<style scoped>
.disappear {
  height: 0px;
  margin: 0px;
  transition: 0.5s;
}
</style>
