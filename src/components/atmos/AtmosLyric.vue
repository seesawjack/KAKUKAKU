<template>
  <div class="mt-5 text-2xl text-left">
    <template v-for="lyric,index in lyrics" :key="lyric">
      <p class="tracking-[2px] before:border-t before:border-dashed" v-html="lyric"></p>
      <div v-if="index !== lyrics.length-1" class="line border-t border-dashed h-px my-2"></div>
    </template>
    </div>
</template>

<script setup>
const props = defineProps({
  lyrics:Array
})

</script>

<style>

</style>