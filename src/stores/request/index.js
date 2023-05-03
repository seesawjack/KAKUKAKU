import { defineStore } from "pinia";

export const useRequestStore = defineStore('request',()=>{

    async function request({ url , method , headers , databody },option={}){
        try {
            const response = await fetch( url , {
                method: method || 'GET',
                body: databody ? JSON.stringify(databody
                    ) : null,
                headers: headers || {
                    'content-type': 'application/json'
                },
                mode: 'cors',
                ...option
            }) 
            if(!response.ok){ throw new Error('Network response was not ok.') }
            const data = await response.json();
            return data;
        } catch (error) {
            return error;
        }
    }
    return { 
        request 
    }
})