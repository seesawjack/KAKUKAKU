<template>
  <div>
    <div id="player"></div>
  </div>
</template>

<script setup>
import { toRefs } from 'vue';
import { useLyricStore } from '../../stores/lyric';

const props = defineProps({
  id: {
    type: String,
    required: true,
  },
});
const { timeStampState } = toRefs(useLyricStore());

const tag = document.createElement("script");
tag.src = "https://www.youtube.com/iframe_api";

const firstScriptTag = document.getElementsByTagName("script")[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

let player;

window.onYouTubeIframeAPIReady = function () {
  player = new YT.Player("player", {
    width: "640",
    height: "390",
    videoId: props.id,
    modestbranding: 1,
    rel: 0,
    playerVars: {
      playsinline: 1,
    },
    events: {
      // onReady: onPlayerReady,
      onStateChange: onPlayerStateChange
    },
  });
};

// function onPlayerReady(event) {
//   event.target.playVideo();
// }

let timer;
function onPlayerStateChange(event) {
  if (event.data === YT.PlayerState.PLAYING) {
    timer = setInterval(timestamp, 100);
  } else {
    clearInterval(timer);
    timer = null;
  }
}

function timestamp() {
  const HhMmSs = new Date(player.getCurrentTime() * 1000).toISOString().slice(11, 23);
  timeStampState.value.push(HhMmSs)

}

</script>

<style></style>