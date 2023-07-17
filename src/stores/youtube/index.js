import { defineStore } from "pinia";
import { ref, toRefs,computed } from 'vue';
import { useLyricStore } from '../lyric/index.js';

export const useYoutubeStore = defineStore('youtube', () => {

    const { timeStampState } = toRefs(useLyricStore());

    const videoId = ref('');
    const tag = document.createElement("script");
    tag.src = "https://www.youtube.com/iframe_api";

    const firstScriptTag = document.getElementsByTagName("script")[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

    let player;

    window.onYouTubeIframeAPIReady = function () {
        player = new YT.Player("player", {
            width: '640',
            height: '390',
            videoId: videoId.value,
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
    function getVideoId(id) {
        videoId.value = id
    }
    let timer;
    function onPlayerStateChange(event) {
        if (event.data === YT.PlayerState.PLAYING) {
            timer = setInterval(timestamp, 100);
            isPlayVideo.value = true;
        } else {
            clearInterval(timer);
            timer = null;
            isPlayVideo.value = false;
        }
    }

    function timestamp() {
        const HhMmSs = new Date(player.getCurrentTime() * 1000).toISOString().slice(11, 23);
        timeStampState.value.push(HhMmSs)
    }

    const isPlayVideo = ref(false);

    function controlVideoPlay(isPlay) {
        if (isPlay) {
            player.playVideo();
        } else {
            player.pauseVideo();
        }
    }

    function controlSeekTo(hhmmss) {
        const hms = hhmmss.split(':');
        const seconds = (+hms[0]) * 60 * 60 + (+hms[1]) * 60 + (+hms[2]);
        player.seekTo(seconds, true);
    }

    function changeScreen(isChange) {
        if (isChange) {
            player.setSize('994','560')
        } else {
            player.setSize('640','390')

        }
    }


    return {
        isPlayVideo,
        getVideoId,
        controlVideoPlay,
        controlSeekTo,
        changeScreen
    }
})