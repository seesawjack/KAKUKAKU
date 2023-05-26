<template>
  <header>
    <div class="logo flex items-center justify-between py-2 px-5">
      <router-link to="/songlist" class="flex items-center">
        <the-logo class="inline h-6 mr-3" />
        <h1 class="text-3 text-lg">KAKUKAKU</h1>
      </router-link>
      <mols-header-configure class="dropdown" />
    </div>
  </header>
</template>

<script setup>
import TheLogo from "../svg/TheLogo.vue";
import MolsHeaderConfigure from "../molecules/MolsHeaderConfigure.vue";
</script>

<style scoped>
header {
  width: 100%;
  position: fixed;
  top: 0px;
  z-index: 40;
}
</style>