<template>
  <div class="lyric mt-5 text-left bg-slate-950/60 px-3 py-2 rounded-xl"
  :class="[font,className]">
    <template v-for="(lyric,index) in lyrics" :key="index">
      <div class="tracking-[2px]" v-html="lyric"></div>
      <div v-if="index !== lyrics.length-1" class="line border-t h-px my-4"></div>
    </template>
    </div>
</template>

<script setup>
import { storeToRefs } from 'pinia'
import { ref,watch } from 'vue';
import { useGlobalStore } from '../../stores/index';

const props = defineProps({
  lyrics:Array,
  className:String,
})

const globalStore = useGlobalStore(); 
const font = ref('text-xl')

watch(()=>globalStore.lyricConfiguration.fontSizeSelecetd,()=>{
  const global = globalStore.lyricConfiguration;
  font.value = global.fontSize[global.fontSizeSelecetd].class[0]
})

</script>

<style scoped>  
.line{
  border-style:inset;
}
rt{
  display: none;
}
</style>