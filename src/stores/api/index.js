import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { useGlobalStore } from "../index";
import useSupabase from "../supabase";

export const useApiStore = defineStore("api", () => {
  const { supabase } = useSupabase();
  const { isError, loadingState } = useGlobalStore();

  const handleSignup = async ({ email, password, ...meta }) => {
    try {
      loadingState(true);
      const { data, error } = await supabase.auth.signUp({
        email: email,
        password: password,
        options: {
          data: {
            ...meta,
            emailRedirectTo: "http://localhost:5173/login",
          },
        },
      });
      if (error) throw error;
      return { message: "success", data: data };
    } catch (error) {
      if (error instanceof Error) {
        return { message: "error", data: error };
      }
    } finally {
      loadingState(false);
    }
    return data;
  };

  const handleLogin = async (info) => {
    loadingState(true);
    const { data, error } = await supabase.auth.signInWithPassword({
      email: info.email,
      password: info.password,
    });
    if (error) throw error;
    loadingState(false);

    return data;
  };

  const handleLogout = async () => {
    loadingState(true);
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    loadingState(false);

    return data;
  };

  const handleFeedBack = async (info) => {
    loadingState(true);
    const { data, error } = await supabase.from("feedback").insert([
      {
        user_name: info.name,
        question_type: info.questionType,
        text: info.feedbackText,
      },
    ]);
    if (error) throw error;
    loadingState(false);
    return data;
  };

  return {
    handleSignup,
    handleLogin,
    handleLogout,
    handleFeedBack,
  };
});
