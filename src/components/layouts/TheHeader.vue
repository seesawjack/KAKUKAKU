<template>
  <header class="relative z-50">
    <div class="logo flex items-center justify-between py-2 px-5">
      <div class="flex items-center">
        <bars-icon class="sidebar mr-3 cursor-pointer" @click="showSidebar" />
        <router-link to="/songlist" class="flex items-center">
          <the-logo class="inline h-6 mr-3" />
          <h1 class="text-3 text-lg">KAKUKAKU</h1>
        </router-link>
      </div>
      <mols-configure class="dropdown" />
    </div>
  </header>
  <atmos-sidebar
    class="sidebar fixed -left-64 transition-all z-30"
    :class="{ show: isShow }"
  />
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue";
import TheLogo from "../svg/TheLogo.vue";
import MolsConfigure from "../molecules/MolsConfigure.vue";
import BarsIcon from "../svg/BarsIcon.vue";
import AtmosSidebar from "../atmos/AtmosSidebar.vue";

const isShow = ref(false);
function showSidebar() {
  isShow.value = !isShow.value;
}

onMounted(() => {
  document.addEventListener("click", () => {
    if (!event.target.closest(".sidebar")) {
      isShow.value = false;
    }
  });
});

onBeforeUnmount(() => {
  document.body.removeEventListener("click", () => {
    if (!event.target.closest(".sidebar")) {
      isShow.value = false;
    }
  });
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