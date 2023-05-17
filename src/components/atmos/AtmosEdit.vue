<template>
  <div>
    <atmos-dialog :show="!!error" title="請輸入 / 貼上 / 上傳歌詞"  @close="handleError">
      <p class="text-white text-center">{{error}}</p>
    </atmos-dialog>
    <textarea
      class="resize-none bg-[transparent] border border-solid rounded-xl py-2 px-5"
      cols="53"
      rows="14"
      v-model.trim="lyric"
      placeholder="輸入 / 貼上 / 上傳歌詞"
    ></textarea>
    <div class="flex">
      <button 
      class="flex-1 border border-solid rounded-xl mr-2 hover:bg-slate-600" 
      @click="sendLyric">確定</button>
      <button class="flex-1 border border-solid rounded-xl">上傳歌詞</button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import AtmosDialog from './AtmosDialog.vue';

const emit = defineEmits(['getLyric']);
const lyric = ref('');
const error = ref(null)

function sendLyric(){
  if(!lyric.value.length){
      error.value = '請輸入或上傳歌詞';
      return;
  }
  emit('getLyric',lyric.value)
}

function handleError(){
  error.value = null
}
</script>

<style>
</style>