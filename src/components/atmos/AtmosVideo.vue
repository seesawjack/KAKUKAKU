<template>
  <div>
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

<style></style>