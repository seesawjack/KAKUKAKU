import { defineStore } from "pinia";
import useSupabase from "../supabase";
import { useGlobalStore } from "../index";
import { ref, toRefs } from 'vue';

export const useAuthStore = defineStore('auth', () => {
    const { supabase } = useSupabase();
    let { isLoading } = toRefs(useGlobalStore());


    const userInfo = ref('');

    function isLoggedIn() {
        return !!userInfo.value
    }
    const handleSignup = async (info) => {
        try {
            isLoading.value = true;
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
            isLoading.value = false;
        }
    }

    const handleLogin = async (info) => {
        try {
            isLoading.value = true;

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
            isLoading.value = false;
        }
    }

    const handleLogout = async () => {
        try {
            isLoading.value = true;
            const { error } = await supabase.auth.signOut();
            if (error) throw error;
            return { message: 'success' }
        } catch (error) {
            if (error instanceof Error) {
                return error
            }
        } finally {
            isLoading.value = false;
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