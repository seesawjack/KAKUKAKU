<template>
  <header class="relative z-50 max-md:bg-slate-900/90">
    <div class="logo flex items-center py-2 px-5">
      <atmos-svg-icon name="icon_bars" class="sidebar mr-3 cursor-pointer" @click="showSidebar"/>
      <router-link to="/KAKUKAKU/song/search" class="flex items-center">
        <atmos-svg-icon name="icon_logo" class="inline h-6 mr-1"/>
        <h1 class="text-3 text-lg">KAKUKAKU</h1>
      </router-link>
    </div>
  </header>
  <atmos-sidebar class="sidebar fixed -left-[100%] transition-all z-30" :class="{ 'show': isShow }" @close-sidebar="handleCloseSidebar"/>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue";

import AtmosSidebar from "../atmos/AtmosSidebar.vue";
import AtmosSvgIcon from "../atmos/AtmosSvgIcon.vue";

const isShow = ref(false);
function showSidebar() {
  isShow.value = !isShow.value;
}
function handleCloseSidebar(){
  isShow.value = false;
}

const notClickSidebar = () => {
  if (!event.target.closest(".sidebar")) {
    isShow.value = false;
  }
}

onMounted(() => {
  document.addEventListener("click", notClickSidebar);
});

onUnmounted(() => {
  document.body.removeEventListener("click", notClickSidebar);
});
</script>

<style scoped>
header {
  width: 100%;
  position: fixed;
  top: 0px;
  z-index: 40;
}

.show {
  left: 0px;
}
</style>