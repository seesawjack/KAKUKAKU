<template>
  <particle-bg />
  <the-header/>
  <router-view class="pt-[56px]"></router-view>
  <the-footer/>
</template>

<script setup>
import TheHeader from './components/layouts/TheHeader.vue';
import ParticleBg from "./components/layouts/ParticleBg.vue";
import TheFooter from './components/layouts/TheFooter.vue';
</script>

<style>
</style>
