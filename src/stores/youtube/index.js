import { defineStore } from "pinia";
import { ref, toRefs } from 'vue';
import { useLyricStore } from '../song/index.js';
import { useRequestStore } from '../request';

export const useYoutubeStore = defineStore('youtube', () => {

    //youtube iframe api stance build
    const { timeStampState } = toRefs(useLyricStore());

    const videoId = ref('');
    const tag = document.createElement("script");
    tag.src = "https://www.youtube.com/iframe_api";

    const firstScriptTag = document.getElementsByTagName("script")[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

    let player;

    window.onYouTubeIframeAPIReady = function () {
        player = new YT.Player("player", {
            width: '854',
            height: '480',
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

    function getVideoId(id) {
        videoId.value = id;
    }

    function changeVideoId(id){
        player.loadVideoById(id);
        player.pauseVideo(); 
        videoId.value = id;             
    }

    let timer;
    //播放狀態改變時
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
    //紀錄播放當下時間戳 
    function timestamp() {
        const HhMmSs = new Date(player.getCurrentTime() * 1000).toISOString().slice(11, 23);
        timeStampState.value.push(HhMmSs)
    }

    const isPlayVideo = ref(false);

    //控制影片播放或暫停
    function controlVideoPlay(isPlay) {
        if (isPlay) {
            player.playVideo();
        } else {
            player.pauseVideo();
        }
    }

    //影片進度移動到指定時間點
    function controlSeekTo(hhmmss) {
        const hms = hhmmss.split(':');
        const seconds = (+hms[0]) * 60 * 60 + (+hms[1]) * 60 + (+hms[2]);
        player.seekTo(seconds, true);
    }

    //youtube 搜尋
    const youtubeURL = ref('https://youtube.googleapis.com/youtube/v3/search?');

    const { request } = useRequestStore();
    const nextPage = ref('');
    const prevPage = ref('');
    const isReasearch = ref(false);

    //搜尋影片
    async function youtubeSearch(value) {
        isReasearch.value = true;
        const queryString = {
            part: "snippet",
            q: encodeURI(value),
            maxResults: 10,
            key: import.meta.env.VITE_YOUTUBE_API_KEY,
        };
        for (const [key, value] of Object.entries(queryString)) {
            youtubeURL.value += `${key}=${value}&`;
        }
        const data = await request({ url: youtubeURL.value });
        nextPage.value = data.nextPageToken;
        prevPage.value = data.prevPageToken;
        return data
    }
    //換頁
    async function youtubePageChange(next) {
        isReasearch.value = false;

        let pageUrl = youtubeURL.value;
        pageUrl += next ? `pageToken=${nextPage.value}` : `pageToken=${prevPage.value}`

        const data = await request({ url: pageUrl });
        nextPage.value = data.nextPageToken;
        prevPage.value = data.prevPageToken;
        return data
    }

    return {
        videoId,
        isPlayVideo,
        isReasearch,
        getVideoId,
        changeVideoId,
        controlVideoPlay,
        controlSeekTo,
        youtubeSearch,
        youtubePageChange,
    }
})