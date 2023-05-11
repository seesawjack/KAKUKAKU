import { defineStore } from "pinia";
import { ref } from 'vue';

export const useGlobalStore = defineStore('global',()=>{
    const selectedSongInfo = ref(null)

    function selectedSong(song){
        localStorage.setItem('songHistory',JSON.stringify(song));
        selectedSongInfo.value = song;
    }
    return{
        selectedSongInfo,
        selectedSong
    }
})