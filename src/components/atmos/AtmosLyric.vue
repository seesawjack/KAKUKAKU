<template>
  <div class="mt-5 text-xl text-left bg-slate-950/60 px-3 py-2 rounded-xl">
    <template v-for="lyric,index in lyrics" :key="lyric">
      <p class="tracking-[2px] before:border-t before:border-dashed" v-html="lyric"></p>
      <div v-if="index !== lyrics.length-1" class="line border-t h-px my-4"></div>
    </template>
    </div>
</template>

<script setup>
const props = defineProps({
  lyrics:Array
})

</script>

<style scoped>  
.line{
  border-style:inset;
}
</style>