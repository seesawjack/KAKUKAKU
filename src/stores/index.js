import { defineStore } from "pinia";
import { ref } from 'vue';

export const useGlobalStore = defineStore('global', () => {
    const selectedSongInfo = ref(null);
    const lyricConfiguration = ref({
        fontSize: {
            big: {
                id:'big',
                name: "大",
                class: ["text-2xl", "leading-9"],
            },
            middle: {
                id:'middle',
                name: "中",
                class: ["text-xl", "leading-[2.4rem]"],
            },
            small: {
                id:'small',
                name: "小",
                class: ["text-base", "leading-[2.4rem]"],
            },
        },
        fontSizeSelecetd:'middle',
        labelType: {
            none:false,
            hiragana:true,
            romaji:false
        },
        allHirgana: false
    })

    function selectedSong(song) {
        localStorage.setItem('songHistory', JSON.stringify(song));
        selectedSongInfo.value = song;
    }

    function selectedFontStyle(style){
        lyricConfiguration.value.fontSizeSelecetd = style;
    }
    return {
        lyricConfiguration,
        selectedSongInfo,
        selectedSong,
        selectedFontStyle
    }
})