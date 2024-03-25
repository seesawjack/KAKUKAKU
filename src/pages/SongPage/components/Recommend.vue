<template>
  <div class="max-md:!w-full flex justify-center max-md:px-5" :class="width">
    <mols-song-detail 
      :furiganaLyrics="furiganaLyrics"
      :hiraganaLyrics="hiraganaLyrics"
      :romajiLyrics="romajiLyrics"
    />
    <mols-configure v-if="songDisplay.show"
      class="max-md:fixed sticky max-md:top-1 top-12 max-md:right-7 z-50 h-[24px] translate-x-4 transition-all" />
  </div>
</template>
    
<script setup>
import { ref, computed } from 'vue';
import { useRoute } from 'vue-router';
import { useLyricStore } from "@/stores/song";
import { useSupabase } from "@/composables/useSupabase";

import MolsSongDetail from "@/components/molecules/MolsSongDetail.vue";
import MolsConfigure from "@/components/molecules/MolsConfigure.vue";

const { getSongInfo, getSongContent } = useSupabase();
const route = useRoute();

const {
  songPageOption: { selected },
  songDisplay
} = useLyricStore();

const width = computed(() => {
  if (songDisplay.show) {
    return selected.dramaMode ? 'w-[72.5%]' : 'w-1/2';
  }
  return 'max-w-[600px] w-full'
})

async function handlePageTitle() {
  const res = await getSongInfo({ videoId: route.query.song_id });
  document.title = res?.data[0]?.title + '｜KAKUKAKU';

}
handlePageTitle();


const furiganaLyrics = ref([]);
const hiraganaLyrics = ref([]);
const romajiLyrics = ref([]);

//取得歌曲
async function getSongData() {
  const response = await getSongContent({ videoId: route.query.song_id });
  furiganaLyrics.value = response.data[0].furigana;
  hiraganaLyrics.value = response.data[0].hiragana;
  romajiLyrics.value = response.data[0].romaji
}
getSongData();
</script>
    