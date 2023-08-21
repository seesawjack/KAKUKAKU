<template>
  <div class="gradient-background">
    <div class="noise-background"></div>
  </div>
</template>

<style lang="scss" scoped>
/* Styles */
.noise-background {
  position: fixed;
  width: 100%;
  height: 100%;
  z-index: 1;
  background: url("../../assets/images/background_noise.png");
}
.gradient-background {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -1;
  background: linear-gradient(5deg, #002025, #3f3251, #002025, #3f3251);
  background-size: 400% 400%;
  background-blend-mode: screen;
  animation: gradient 20s ease-in-out infinite;
}

@keyframes gradient {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}
</style>
