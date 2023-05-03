import { defineStore } from "pinia";
import { ref } from 'vue';

export const useGlobalStore = defineStore('global',()=>{
    const selectedSongInfo = ref({
        id:'',
        title:'',
        url:'',
        width:'',
        height:''
    })
    
})