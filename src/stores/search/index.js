import { defineStore } from "pinia";
import { ref } from 'vue';
import { useRequestStore } from '../request';

export const useSearchStore = defineStore('search', () => {
    const { request } = useRequestStore();

    const youtubeURL = ref('https://youtube.googleapis.com/youtube/v3/search?');
    const nextPage = ref('');
    const prevPage = ref('');
    const isReasearch = ref(false);

    async function youtubeSearch(value) {
        isReasearch.value = true;

        const queryString = {
            part: "snippet",
            q: encodeURI(value),
            maxResults: 10,
            key: import.meta.env.VITE_YOUTUBE_API_KEY,
        };
        for (const [key, value] of Object.entries(queryString)) {
            youtubeURL.value += `${key}=${value}&`;
        }
        const data = await request({ url: youtubeURL.value });
        nextPage.value = data.nextPageToken;
        prevPage.value = data.prevPageToken;

        return data
    }

    async function youtubePageChange(next) {
        isReasearch.value = false;

        let pageUrl = youtubeURL.value;
        pageUrl += next ? `pageToken=${nextPage.value}` : `pageToken=${prevPage.value}`

        const data = await request({ url: pageUrl });
        nextPage.value = data.nextPageToken;
        prevPage.value = data.prevPageToken;
        return data
    }

    return {
        youtubeSearch,
        youtubePageChange,
        isReasearch
    }
})