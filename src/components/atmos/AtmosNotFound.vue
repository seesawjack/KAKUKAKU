<template>
  <div class="left-50 top-60 mt-32 max-sm:px-8 px-16 pt-9 pb-14 rounded-lg bg-gray-600/40">
    <img
      src="/src/assets/images/forbidden.png"
      :alt="tips"
      width="150"
      class="mx-auto mb-3 cursor-pointer transition-all"
      :class="catAnimate"
      @click="catSound"
    />
    <p>{{tips}}</p>
  </div>
</template>

<script setup>
import { reactive, onUnmounted } from "vue";

const props = defineProps({
  tips: {
    type: String,
    required: true,
  },
});

const catAnimate = reactive({
  move: false,
});

let timer;
function catSound() {
  const audio = new Audio("/src/assets/sound/cat_meow.mp3");
  audio.play();
  catAnimate.move = true;

  timer = setTimeout(() => {
    catAnimate.move = false;
  }, 1000);
}
onUnmounted(() => clearTimeout(timer));
</script>

<style scoped>
.move {
  animation: catmove 0.3s linear infinite;
}

@keyframes catmove {
  0% {
    transform: translateX(0px);
  }
  25% {
    transform: translateX(-3px);
  }
  50% {
    transform: translateX(3px);
  }
  75% {
    transform: translateX(-5px);
  }
  100% {
    transform: translateX(0px);
  }
}
</style>
