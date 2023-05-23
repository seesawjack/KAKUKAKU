import { defineStore } from "pinia";
import { ref } from "vue";
import { useRequestStore } from '../request';

export const useSearchStore = defineStore('search', () => {
    const { request } = useRequestStore();
    
    async function youtubeSearch(value) {
        let youtubeURL = "https://youtube.googleapis.com/youtube/v3/search?";
        const queryString = {
            part: "snippet",
            q: encodeURI(value),
            maxResults: 10,
            key: import.meta.env.VITE_YOUTUBE_API_KEY,
        };
        for (const [key, value] of Object.entries(queryString)) {
            youtubeURL += `${key}=${value}&`;
        }
        return await request({ url: youtubeURL });
    }

    return{
        youtubeSearch
    }
})