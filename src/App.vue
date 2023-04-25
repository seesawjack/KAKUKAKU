<script setup>
import { ref } from 'vue';
import { diff_match_patch }from 'diff-match-patch';
import { useRequestStore } from './stores/request';
import { useHiraganaStore } from './stores/hiragana';

const reqStore = useRequestStore();
const hiraganaStore = useHiraganaStore();

const lyrics = ref('');
const resultLyrics = hiraganaStore.resultLyrics; 
async function generateHiraganaLyrics(){
  const reqData = hiraganaStore.updateLyricsInput(lyrics.value.value.replace(/\n/g,'||'));
  const hiraganaLyrics = await reqStore.request(JSON.stringify(reqData))
  hiraganaStore.kanjiLabelHiragana(hiraganaLyrics.converted,lyrics.value.value)

}

</script>

<template>
  <div>
    <div>
      <label for="">歌詞</label>
      <textarea name="" id="" cols="100" rows="10" ref="lyrics"></textarea>
    </div>
    <template v-if="resultLyrics.length">
      <div v-html="resultLyrics.join('')"></div>
    </template>
    <button @click="generateHiraganaLyrics">點我</button>
  </div>
</template>

<style scoped>
</style>
