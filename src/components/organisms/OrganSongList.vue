<template>
  <div class="w-full ease-in-out duration-700" :class="[isActive ? '' : 'mt-56']">
    <mols-search-song :className="disappear" @search="searchResult">
      <h1 class="max-sm:text-2xl text-5xl" :class="{ 'move-down': isActive }">{{ showOnPage }}</h1>
    </mols-search-song>
    <mols-list-card class="max-w-[512px] mx-auto mt-5" :resultData="resultData" />
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from "vue";
import MolsListCard from "../molecules/MolsListCard.vue";
import MolsSearchSong from '../molecules/MolsSearchSong.vue';


const slogan = ref('一鍵平假名，輕鬆學日文歌');
const showOnPage = ref('');

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
})
const isActive = ref(false);
const resultData = ref({});
const disappear = ref("");

async function searchResult(value) {
  if (!isActive.value) {
    isActive.value = true;
    setTimeout(() => {
      disappear.value = "disappear";
    }, 300);
  }

  resultData.value = value;
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
