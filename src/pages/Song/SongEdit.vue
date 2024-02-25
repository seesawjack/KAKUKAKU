<template>
    <div class="flex flex-col max-md:px-5 max-w-[510px] mx-auto">
      <div v-if="isYoutubeSearch" class="relative max-md:pt-7 pt-5">
        <atmos-card
          :id="songInfo.id"
          :url="songInfo.url"
          :width="songInfo.width"
          :height="songInfo.height"
          :title="songInfo.title"
          :subTitle="songInfo.subTitle"
        />
        <atmos-keywords :song-info="songInfo"/>
      </div>
      <mols-edit :isYoutubeSearch="isYoutubeSearch"/>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from "vue";
  import { useRoute } from "vue-router";
  
  import AtmosCard from "@/components/atmos/AtmosCard.vue";
  import AtmosKeywords from "@/components/atmos/AtmosKeywords.vue";
  import MolsEdit from "@/components/molecules/MolsEdit.vue";
  
  const route = useRoute();
  const isYoutubeSearch = ref(false);
  const songInfo = ref({});
  
  function handleSongInfo(){
    songInfo.value = JSON.parse(localStorage.getItem("songInfo"));
  }
  
  //根據網址參數的 song_id 是否符合 API 中對應的 id 值來顯示已選歌曲的資訊
  onMounted(() => {
    handleSongInfo();
    if (route.query.song_id) {
      return isYoutubeSearch.value = route.query.song_id === songInfo.value.id;
    }
  });
  </script>
  
  <style>
  </style>