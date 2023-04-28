import { defineStore } from "pinia";

export const useRequestStore = defineStore('request',()=>{
    const requestOptions = {
        method: '',
        headers: { "Content-Type": "application/json" },
        body: ''
    }

    async function request(url,method = 'POST',body = ''){
        try {
            requestOptions.method = method;  
            requestOptions.body = body;
            const response = await fetch(url, requestOptions.value) 
            if(!response.ok){ throw new Error('Network response was not ok.') }
            const data = await response.json();
            return data;
        } catch (error) {
            return error;
        }
    }
    return { 
        requestOptions, 
        request 
    }
})