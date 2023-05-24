import { defineStore } from "pinia";
import { reactive } from 'vue';

export const useAuthStore = defineStore('auth',()=>{
    const formInfo = reactive({
        signin:{
            email:{
                icon:'UserIcon',
                tips:'信箱',
                value:''
            },
            password:{
                icon:'PasswordIcon',
                tips:'密碼',
                value:''
            }
        },
        signup:{
            userName:{
                icon:'UserIcon',
                tips:'使用者名稱',
                value:''
            },
            email:{
                icon:'EmailIcon',
                tips:'信箱',
                value:''
            },
            password:{
                icon:'PasswordIcon',
                tips:'密碼',
                value:''
            },
            checkPassword:{
                icon:'PasswordIcon',
                tips:'再次確認密碼',
                value:''
            }
        }
    })
    return{
        formInfo
    }
})