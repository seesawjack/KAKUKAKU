import { defineStore } from "pinia";
import { useRequestStore } from "../request";

export const useApiStore = defineStore("api", () => {
  const { supabase } = useRequestStore();

  //註冊
  const handleSignup = async ({ email, password, ...meta }) => {
    const { data, error } = await supabase.auth.signUp({
      email: email,
      password: password,
      options: {
        data: {
          ...meta,
        },
        emailRedirectTo: "http://localhost:5173/onboarding",
      },
    });
    if (error) return { error };
    return { data };
  };

  //登入
  const handleLogin = async ({ email, password }) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });
    if (error) return { error };
    return { data };
  };

  //登出
  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) return { error };
  };

  //回饋表單
  const handleFeedBack = async ({ name, type, text }) => {
    const { data, error } = await supabase.from("feedback").insert([
      {
        user_name: name,
        question_type: type,
        text: text,
      },
    ]);
    if (error) return { error };
    return { data };
  };

  return {
    handleSignup,
    handleLogin,
    handleLogout,
    handleFeedBack,
  };
});
