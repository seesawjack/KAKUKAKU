<template>
  <div class="ease-in-out duration-700" :class="[isActive ? '' : 'mt-56']">
    <mols-search-song :className="disappear" @search="searchResult">
      <h1 :class="{ 'move-down': isActive }">一鍵平假名，輕鬆學日文歌</h1>
    </mols-search-song>
    <mols-list-card
      class="max-w-[512px] mx-auto mt-5"
      :resultData="resultData"
    />
  </div>
</template>

<script setup>
import { ref } from "vue";
import MolsListCard from "../molecules/MolsListCard.vue";
import MolsSearchSong from '../molecules/MolsSearchSong.vue';

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
