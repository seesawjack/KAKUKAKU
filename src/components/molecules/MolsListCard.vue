<template>
  <div>
    <div class="border border-transparent transition-all ml-2 mb-5 group cursor-pointer hover:bg-slate-300/[0.2]"
      v-for="item in resultData.items" :key="item.id.videoId || item.id.channelId">
      <atmos-card :data="item.snippet" :id="item.id.videoId || item.id.channelId"
        :href="`/KAKUKAKU/song/upload?song_id=${item.id.videoId || item.id.channelId}`" />
    </div>
  </div>
</template>

<script setup>
import AtmosCard from "../atmos/AtmosCard.vue";
const props = defineProps({
  resultData: {
    type: Object,
    required: true,
  },
});
</script>