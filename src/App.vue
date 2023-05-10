<template>
  <particle-bg />
  <router-view></router-view>
</template>

<script setup>
import ParticleBg from "./components/layouts/ParticleBg.vue";
</script>

<style>
body {
  position: relative;
  z-index: -2;
  background: #2c2d44;
  background-image: linear-gradient(45deg, #3f3251 2%, #002025 100%);
}
</style>
