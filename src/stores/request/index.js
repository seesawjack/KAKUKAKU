import { defineStore } from "pinia";
import { ref } from "vue";

export const useRequestStore = defineStore('request',()=>{
    const requestOptions = ref({
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: ''
    })

    async function request(body){
        try {  
            requestOptions.value.body = body
            const response = await fetch("https://labs.goo.ne.jp/api/hiragana", requestOptions.value) 
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