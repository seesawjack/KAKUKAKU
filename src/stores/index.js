import { defineStore } from "pinia";
import { ref } from 'vue';

export const useGlobalStore = defineStore('global',()=>{
    const selectedSongInfo = ref({
        id:'',
        url:'',
        width:'',
        height:'',
        title:'',
        subTitle:''
    })

    function selectedSong(song){
        console.log('%c 結果 ', 'background: #EA0000; color: #ffffff','有觸發');
        selectedSongInfo.value = song
        console.log('%c 結果 ', 'background: #009393; color: #ffffff',selectedSongInfo);
    }
    return{
        selectedSongInfo,
        selectedSong
    }
})