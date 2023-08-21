<template>
  <header class="relative z-50">
    <div class="logo flex items-center py-2 px-5">
      <bars-icon class="sidebar mr-3 cursor-pointer" @click="showSidebar" />
      <router-link to="/KAKUKAKU/song/search" class="flex items-center">
        <the-logo class="inline h-6 mr-1" />
        <h1 class="text-3 text-lg">KAKUKAKU</h1>
      </router-link>
    </div>
  </header>
  <atmos-sidebar class="sidebar fixed -left-[100%] transition-all z-30" :class="{ 'show': isShow }" />
</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import TheLogo from "../svg/TheLogo.vue";
import BarsIcon from "../svg/BarsIcon.vue";
import AtmosSidebar from "../atmos/AtmosSidebar.vue";

const isShow = ref(false);
function showSidebar() {
  isShow.value = !isShow.value;
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