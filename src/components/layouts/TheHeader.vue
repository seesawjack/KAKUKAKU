<template>
  <header>
    <div class="logo py-2 px-5">
      <router-link to="/songlist" class="flex items-center">
        <the-logo class="h-10 inline mr-3" />
        <h1 class="text-3 text-lg">KAKUKAKU</h1>
      </router-link>
    </div>
  </header>
</template>

<script setup>
import TheLogo from "../svg/TheLogo.vue";
</script>