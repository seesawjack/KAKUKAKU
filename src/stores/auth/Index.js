import { defineStore } from "pinia";
import { reactive } from 'vue';

export const useAuthStore = defineStore('auth',()=>{
    const formInfo = reactive({
        signin:{
            email:{
                icon:'UserIcon',
                tips:'信箱',
                type:'email',
                value:''
            },
            password:{
                icon:'PasswordIcon',
                tips:'密碼',
                type:'password',
                value:''
            }
        },
        signup:{
            userName:{
                icon:'UserIcon',
                tips:'使用者名稱',
                type:'text',
                value:''
            },
            email:{
                icon:'EmailIcon',
                tips:'信箱',
                type:'email',
                value:''
            },
            password:{
                icon:'PasswordIcon',
                tips:'密碼',
                type:'password',
                value:''
            },
            checkPassword:{
                icon:'PasswordIcon',
                tips:'再次確認密碼',
                type:'password',
                value:''
            }
        },
        custom:{
            gender:[],
            level:[],
            birth:''
        }
    })
    return{
        formInfo
    }
})