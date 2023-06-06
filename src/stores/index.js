import { defineStore } from "pinia";
import { ref, reactive } from 'vue';

export const useGlobalStore = defineStore('global', () => {
    
    const isLoading = ref(false);

    const errorMessage = reactive({ isError: false, message: '' });

    function isError({ isError, message }) {
        errorMessage.isError = isError;
        errorMessage.message = message;
        return;
    }
    
    return {
        isLoading,
        errorMessage,
        isError
    }
})