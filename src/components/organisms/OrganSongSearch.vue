<template>
  <div
    class="w-full ease-in-out duration-700"
    :class="[isActive ? 'mt-5' : '!mt-56']"
  >
    <mols-song-search :className="disappear" @search="searchResult">
      <h1
        class="max-sm:text-2xl max-sm:h-8 text-5xl h-12"
        :class="{ 'move-down': isActive }"
      >
        {{ showOnPage }}
      </h1>
    </mols-song-search>
    <mols-list-card
      class="max-md:px-3 max-md:pl-5 max-w-[512px] mx-auto mt-5"
      :resultData="resultData"
    />
    <atmos-pagination
      v-if="resultData?.items?.length > 9"
      @search="pageChagne"
      :now-page="page+1"
      :totalPages="totalPage || 0"
    />
  </div>
</template>

<script setup>
import { ref, watch } from "vue";
import { useYoutubeStore } from "../../stores/youtube";
import { useGlobalStore } from "../../stores/index";

import MolsListCard from "../molecules/MolsListCard.vue";
import MolsSongSearch from "../molecules/MolsSongSearch.vue";
import AtmosPagination from "../atmos/AtmosPagination.vue";

const { youtubePageChange } = useYoutubeStore();
const { loadingState } = useGlobalStore();

//首頁搜尋框上方 slogan typing 載入動畫
const slogan = ref("一鍵平假名，輕鬆學日文歌");
const showOnPage = ref("");
const charIndex = ref(0);

function typingAnimation() {
  showOnPage.value = slogan.value.slice(0, charIndex.value);
  charIndex.value += 1;
}

const loopShowSlogan = setInterval(typingAnimation, 150);

watch(charIndex, () => {
  if (charIndex.value === slogan.value.length + 1) {
    clearInterval(loopShowSlogan);
  }
});

//根據搜尋框是否有文字進行 (1)slogan 文字向下淡出 (2)將搜尋資料傳給 molsListCard 組件
const isActive = ref(false);
const resultData = ref({});
const disappear = ref("");
const totalPage = ref(0);
const page = ref(0);

async function searchResult(value) {
  page.value = 0;
  if (!isActive.value) {
    isActive.value = true;
    setTimeout(() => {
      disappear.value = "disappear";
    }, 300);
  }
  resultData.value = value;
  totalPage.value = parseInt(value.pageInfo?.totalResults / 10)
}

async function pageChagne(value) {
  page.value += value ? 1 : -1;
  loadingState(true);
  const data = await youtubePageChange(value);
  resultData.value = data;
  loadingState(false);
}
</script>

<style scoped>
h1 {
  color: #fff;
  font-family: "Helvetica", "Arial", "LiHei Pro", "黑體-繁", "微軟正黑體",
    sans-serif;
  letter-spacing: 0.15rem;
}

.move-down {
  animation: move-down 0.3s ease-in forwards;
}

.disappear {
  height: 0px;
  margin: 0px;
  transition: 0.5s;
}

@keyframes move-down {
  from {
    transform: translateY(0);
  }

  to {
    transform: translateY(100px);
  }
}
</style>
