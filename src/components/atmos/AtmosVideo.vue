<template>
  <div class="video-container">
    <div id="player"></div>
  </div>
</template>

<script setup>
import { useYoutubeStore } from '../../stores/youtube';

const props = defineProps({
  id: {
    type: String,
    required: true,
  },
});

const { getVideoId } = useYoutubeStore();

useYoutubeStore();
getVideoId(props.id);
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