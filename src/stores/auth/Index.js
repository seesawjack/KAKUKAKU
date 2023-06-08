import { defineStore } from "pinia";
import useSupabase from "../supabase";
import { useGlobalStore } from "../index";
import { ref } from 'vue';

export const useAuthStore = defineStore('auth', () => {
    const { supabase } = useSupabase();
    const { loadingState } = useGlobalStore();


    const userInfo = ref('');

    function isLoggedIn() {
        return !!userInfo.value
    }
    const handleSignup = async (info) => {
        try {
            loadingState(true);
            const { data, error } = await supabase.auth.signUp({
                email: info.email,
                password: info.password,
                options: {
                    data: {
                        name: info.name,
                        birth: info.birth,
                        gender: info.gender,
                        level: info.level,
                        emailRedirectTo: "http://localhost:5173/login",
                    },
                },
            });
            if (error) throw error;
            return { message: 'success', data: data }
        } catch (error) {
            if (error instanceof Error) {
                return { message: 'error', data: error }
            }
        } finally {
            loadingState(false);
        }
    }

    const handleLogin = async (info) => {
        try {
            loadingState(true);

            const { data, error } = await supabase.auth.signInWithPassword({
                email: info.email,
                password: info.password,
            })
            if (error) throw error;
            return { message: 'success', data: data }
        } catch (error) {
            if (error instanceof Error) {
                return { message: 'error', data: error }
            }
        } finally {
            loadingState(false);
        }
    }

    const handleLogout = async () => {
        try {
            loadingState(true);
            const { error } = await supabase.auth.signOut();
            if (error) throw error;
            return { message: 'success' }
        } catch (error) {
            if (error instanceof Error) {
                return error
            }
        } finally {
            loadingState(false);
        }
    }

    return {
        userInfo,
        handleLogin,
        handleSignup,
        handleLogout,
        isLoggedIn
    }
})