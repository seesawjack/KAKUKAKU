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
        selectedSongInfo.value = song
    }
    return{
        selectedSongInfo,
        selectedSong
    }
})