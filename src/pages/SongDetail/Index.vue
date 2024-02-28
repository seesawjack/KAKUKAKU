<template>
  <div class="max-md:!w-full flex justify-center max-md:px-5" :class="widthContainer">
    <mols-song-item />
    <mols-configure v-if="songDisplay.show"
      class="max-md:fixed sticky max-md:top-1 top-12 max-md:right-7 z-50 h-[24px] translate-x-4 transition-all" />
  </div>
</template>
  
<script setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import { useLyricStore } from "@/stores/song";
import { useSupabase } from "@/composables/useSupabase";

import MolsSongItem from "@/components/molecules/MolsSongItem.vue";
import MolsConfigure from "@/components/molecules/MolsConfigure.vue";

const { supabase } = useSupabase();
const route = useRoute();

const {
  songPageOption: { selected },
  songDisplay
} = useLyricStore();

const widthContainer = computed(() => {
  if (songDisplay.show) {
    return selected.dramaMode ? 'w-[72.5%]' : 'w-1/2';
  }
  return 'max-w-[600px] w-full'
})

async function handlePageTitle() {
  const songInfo = localStorage.getItem('songInfo');
  const res = await supabase
    .from("lyrics_list")
    .select()
    .eq("video_id", route.query.song_id);

  if (res?.data.length) {
    document.title = res?.data[0]?.title + '｜KAKUKAKU';
  }else if(songInfo){
    document.title = JSON.parse(songInfo).title; 
  }

}
handlePageTitle();
</script>
  