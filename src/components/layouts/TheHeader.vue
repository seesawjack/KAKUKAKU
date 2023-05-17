<template>
  <header>
    <div class="logo flex items-center justify-between py-2 px-5">
      <router-link to="/songlist" class="flex items-center">
        <the-logo class="h-10 inline mr-3" />
        <h1 class="text-3 text-lg">KAKUKAKU</h1>
      </router-link>
      <mols-header-configure />
    </div>
  </header>
</template>

<script setup>
import TheLogo from "../svg/TheLogo.vue";
import MolsHeaderConfigure from "../molecules/MolsHeaderConfigure.vue";
</script>