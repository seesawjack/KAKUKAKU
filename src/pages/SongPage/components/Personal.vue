<template>
    <div class="max-md:!w-full flex justify-center max-md:px-5" :class="width">
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
  
  const { supabase, getUserSongInfo } = useSupabase();
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
    try {
      const res = await supabase
        .from("lyrics_list")
        .select()
        .eq("video_id", route.query.song_id);
  
      if (!res?.data.length) {
        throw new Error('Try again')
      }
  
      document.title = res?.data[0]?.title + '｜KAKUKAKU';
    } catch (error) {
      console.log(error)
    }
  
  }
  handlePageTitle();
  
  const { user: { id: userId }} = JSON.parse(localStorage.getItem('sb-twcggyswaynhkvxrkhtr-auth-token'));
  
  //取得歌曲
  // async function getSongData() {
  //   const response = await getUserSongInfo({
  //     videoId: route.query.song_id,
  //     userId: userId,
  //   });
  //   console.log(response);
  // }
  // getSongData();
  </script>
    