import { defineStore } from "pinia";
import { ref,reactive } from 'vue';

export const useGlobalStore = defineStore('global', () => {
    const selectedSongInfo = ref(null);
    const lyricConfiguration = reactive({
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
        labelType: {
            none:{
                id:'none',
                name:'無',
            },
            hiragana:{
                id:'hiragana',
                name:'平假名',
            },
            romaji:{
                id:'romaji',
                name:'羅馬字',
            }
        },
        selected:{
            fontSize:'middle',
            labelType:'hiragana',
            allHiragana: false,
            fixedVideo: false
        }
    })

    function selectedSong(song) {
        localStorage.setItem('songHistory', JSON.stringify(song));
        selectedSongInfo.value = song;
    }
    function selectedFontStyle(style){
        lyricConfiguration.selected.fontSize = style;
    }
    function selectedLabelStyle(type){
        lyricConfiguration.selected.labelType = type; 
    }
    return {
        lyricConfiguration,
        selectedSongInfo,
        selectedSong,
        selectedFontStyle,
        selectedLabelStyle
    }
})