<template>
  <h1 class="mb-5 mx-auto">一鍵平假名，輕鬆搞定日文歌</h1>
  <atmos-input
    @search-result="searchResult"
    :inputPh="'請輸入您要搜尋的音樂'"
  />
  <mols-list-card class="max-w-[512px] mx-auto mt-5" :resultData="resultData" />
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRequestStore } from "../../stores/request";
import AtmosInput from "../atmos/AtmosInput.vue";
import MolsListCard from "../molecules/MolsListCard.vue";

const reqStroe = useRequestStore();
let youtubeURL = ref("https://youtube.googleapis.com/youtube/v3/search?");
const resultData = ref({});
const queryString = {
  part: "snippet",
  q: "",
  maxResults: 10,
  key: import.meta.env.VITE_YOUTUBE_API_KEY,
};
const error = ref("");

async function searchResult(inputValue) {
  queryString.q = encodeURI(inputValue);
  for (const [key, value] of Object.entries(queryString)) {
    youtubeURL.value += `${key}=${value}&`;
  }
  resultData.value = await reqStroe.request({ url: youtubeURL.value });
}

// onMounted(() => {
//   searchResult("the first take");
// });
</script>

<style scoped>


/* DEMO-SPECIFIC STYLES */
h1 {
  width: 627px;
  color: #fff;
  font-family: monospace;
  overflow: hidden; /* Ensures the content is not revealed until the animation */
  border-right: .15rem solid rgb(79, 124, 196); /* The typwriter cursor */
  white-space: nowrap; /* Keeps the content on a single line */
  letter-spacing: .15rem; /* Adjust as needed */
  animation: 
    typing 3.5s steps(30, end),
    blink-caret .7s step-end infinite;
}

/* The typing effect */
@keyframes typing {
  from { width: 0 }
  to { width: 615px }
}

/* The typewriter cursor effect */
@keyframes blink-caret {
  from, to { border-color: transparent }
  50% { border-color: rgb(79, 124, 196) }
}
</style>
