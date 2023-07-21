import { defineStore } from "pinia";
import { ref, reactive } from 'vue';

export const useGlobalStore = defineStore('global', () => {
    
    const isLoading = ref(false);
    function loadingState(value){
        isLoading.value = value;
    }

    const errorMessage = reactive({ showError: false, message: '' });
    
    function isError({ showError, message }) {
        errorMessage.showError = showError;
        errorMessage.message = message;
    }
    
    return {
        isLoading,
        errorMessage,
        isError,
        loadingState
    }
})