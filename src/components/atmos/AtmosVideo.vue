<template>
  <div class="video-container" :class="{ 'sticky top-0 z-10': videoFixed }">
    <div id="player"></div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useYoutubeStore } from "../../stores/youtube";
import { useLyricStore } from "../../stores/song";

const props = defineProps({
  id: {
    type: String,
    required: true,
  },
});

const { getVideoId } = useYoutubeStore();
const {
  songPageOption: { selected },
} = useLyricStore();

useYoutubeStore();
getVideoId(props.id);

const videoFixed = computed(() => {
  return selected.fixedVideo ? true : false;
});
</script>

<style>
.video-container {
  position: relative;
  width: 100%;
  height: 0;
  padding-bottom: 56.25%;
}

.video-container iframe {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}
</style>
