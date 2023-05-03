<template>
  <atmos-input @search-result="searchResult" :inputPh="'請輸入您要搜尋的音樂'"/>
  <mols-list-card class="max-w-[512px] mx-auto mt-5" :resultData="resultData"/>
</template>

<script setup>
import { ref,onMounted } from 'vue';
import { useRequestStore } from '../../stores/request';
import AtmosInput from '../atmos/AtmosInput.vue';
import MolsListCard from '../molecules/MolsListCard.vue';

const reqStroe = useRequestStore();
let youtubeURL = ref('https://youtube.googleapis.com/youtube/v3/search?');
const resultData = ref({})
const queryString = {
    'part':'snippet',
    'q':'',
    'maxResults':10,
    'key':import.meta.env.VITE_YOUTUBE_API_KEY
}

async function searchResult(inputValue){
    queryString.q = encodeURI(inputValue)
    for(const [key,value] of Object.entries(queryString)){
        youtubeURL.value += `${key}=${value}&`   
    }
    // resultData.value = await reqStroe.request({ url : youtubeURL.value });
}

onMounted(()=>{
    searchResult('the first take')
})
</script>
