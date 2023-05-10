import { defineStore } from "pinia";
import { ref,onMounted } from 'vue';

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
        localStorage.setItem('songHistory',JSON.stringify(song));
        selectedSongInfo.value = song
    }
    return{
        selectedSongInfo,
        selectedSong
    }
})