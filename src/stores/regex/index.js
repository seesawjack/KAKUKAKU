import { defineStore } from "pinia";

export const useRegexStore = defineStore('regex',()=>{
    const passwordRegex = function(value){
        return /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,30}$/g.test(value)
    }
    
    return{
        passwordRegex
    }
})