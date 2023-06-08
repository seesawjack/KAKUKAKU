<template>
  <div>
    <div id="player"></div>
  </div>
</template>

<script setup>
const props = defineProps({
  id: {
    type: String,
    required: true,
  },
});

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
    playerVars: {
      playsinline: 1,
    },
    // events: {
    //   onReady: onPlayerReady,
    //   onStateChange: onPlayerStateChang
    // },
  });
};

function onPlayerReady(event) {
  event.target.playVideo();
}

let done = false;

// function onPlayerStateChange(event) {
//   if (event.data == YT.PlayerState.PLAYING && !done) {
//     setTimeout(stopVideo, 6000);
//     done = true;
//   }
// }
function stopVideo() {
  player.stopVideo();
}

// onMounted(()=>{
//   onPlayerReady();
// })
</script>

<style>
</style>