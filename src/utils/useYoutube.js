export default class Youtube {
    constructor(videoID) {
        this.videoId = videoID;
        this.player = null;
    }

    init() {
        const tag = document.createElement("script");
        tag.src = "https://www.youtube.com/iframe_api";
        const firstScriptTag = document.getElementsByTagName("script")[0];
        firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

        window.onYouTubeIframeAPIReady = function () {
            this.player = new YT.Player("player", {
                width: '854',
                height: '480',
                videoId: this.videoId,
                modestbranding: 1,
                rel: 0,
                playerVars: {
                    playsinline: 1,
                },
                events: {
                    onStateChange: onPlayerStateChange
                },
            });
        };
    }

    get videoId(){
        return this.videoId;
    }

    set videoId(id){
        this.videoId = id;
    }   

    changeVideoId(id) {
        this.player.loadVideoById(id);
        this.player.pauseVideo(); 
    }


}