import { defineStore } from "pinia";
import { ref, reactive } from 'vue';
import { createClient } from '@supabase/supabase-js';

export const useAuthStore = defineStore('auth', () => {
    const supabaseUrl = 'https://twcggyswaynhkvxrkhtr.supabase.co';
    const supabaseKey = import.meta.env.VITE_SUPABASE_KEY;
    const supabase = createClient(supabaseUrl, supabaseKey);
    const authState = ref('');

    const handleLogin = async (info) => {
        try {
            const { error } = await supabase.auth.signInWithPassword({
                email: info.email,
                password: info.password,
            })
            if (error) throw error;
        } catch (error) {
            if (error instanceof Error) {
                alert(error.message);
            }
        } finally {

        }
    }

    const handleSingup = async (info) => {
        try {
            const { data, error } = await supabase.auth.signUp({
                email: info.email,
                password: info.password,
                options: {
                    data: {
                        birth: info.birth,
                        gender: info.gender,
                        level: info.level,
                        emailRedirectTo: "http://localhost:5173/",
                    },
                },
            });
            if (error) throw error;
            return data
        } catch (error) {
            if (error instanceof Error) {
                alert(error.message);
            }
        }
    }

    return {
        handleLogin,
        handleSingup
    }
})