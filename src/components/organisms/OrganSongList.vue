<template>
  <div class="ease-in-out duration-700" :class="[isActive?'':'mt-56']">
    <div
      class="w-[640px] h-[56px] overflow-hidden mb-5 mx-auto"
      :class="disappear"
    >
      <h1 :class="{ 'move-down': isActive }">一鍵平假名，輕鬆學日文歌</h1>
    </div>
    <atmos-input @search-result="searchResult" :inputTips="'請輸入歌曲名稱'" />
    <mols-list-card
      class="max-w-[512px] mx-auto mt-5"
      :resultData="resultData"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { useSearchStore } from "../../stores/search";
import AtmosInput from "../atmos/AtmosInput.vue";
import MolsListCard from "../molecules/MolsListCard.vue";

const { youtubeSearch } = useSearchStore();
const isActive = ref(false);
const resultData = ref({});
const disappear = ref();

async function searchResult(value) {
  if (!isActive.value) {
    isActive.value = true;
    setTimeout(() => {
      disappear.value = "disappear";
    }, 300);
  }

  resultData.value = await youtubeSearch(value);
}
</script>

<style scoped>
h1 {
  color: #fff;
  font-family: "Helvetica", "Arial", "LiHei Pro", "黑體-繁", "微軟正黑體",
    sans-serif;
  overflow: hidden;
  border-right: 0.15rem solid rgb(79, 124, 196);
  white-space: nowrap;
  letter-spacing: 0.15rem;
  animation: typing 3s steps(30, end), blink-caret 0.7s step-end infinite;
}

.move-down {
  animation: move-down 0.3s ease-in forwards;
}

.disappear {
  height: 0px;
  margin: 0px;
  transition: 0.5s;
}

@keyframes typing {
  from {
    width: 0;
  }
  to {
    width: 100%;
  }
}

@keyframes blink-caret {
  from,
  to {
    border-color: transparent;
  }
  50% {
    border-color: rgb(79, 124, 196);
  }
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
