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

  //忘記密碼寄信
  const sendPasswordResetEmail = async ({ email }) => {
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: "http://localhost:5173/account/update-password",
    });
    if (error) return { error };
    return { data };
  };

  //重設密碼
  const handlePasswordReset = async ({ password }) => {
    await supabase.auth.updateUser({ password: password });
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

  //單一歌曲推薦更新
  const handleSongRecommendUpdate = async ({
    isRecommend,
    videoId,
    userId,
  }) => {
    const { data, error } = await supabase
      .from("lyrics_list")
      .update({ recommend: isRecommend })
      .eq("video_id", videoId)
      .eq("user_id", userId);

    if (error) return { error };
    return { data };
  };

  //單一歌曲內容更新
  const handleSongContentUpdate = async ({
    hiragana,
    romaji,
    furigana,
    timestamp,
    spaceIndex,
    videoId,
    userId,
  }) => {
    const { data, error } = await supabase
      .from("lyrics_content")
      .update({
        hiragana: hiragana,
        romaji: romaji,
        furigana: furigana,
        timestamp: timestamp,
        spaceIndex: spaceIndex,
      })
      .eq("video_id", videoId)
      .eq("user_id", userId);

    if (error) return { error };
    return { data };
  };

  //新增單一歌曲資訊
  const handleSongInfoAdd = async ({
    userId,
    videoId,
    title,
    img,
    isRecommend,
  }) => {
    const { data, error } = await supabase.from("lyrics_list").insert([
      {
        user_id: userId,
        video_id: videoId,
        title: title,
        video_img: img,
        recommend: isRecommend,
      },
    ]);

    if (error) return { error };
    return { data };
  };

  //新增單一歌曲內容
  const handleSongContentAdd = async ({
    userId,
    videoId,
    hiragana,
    romaji,
    furigana,
    timestamp,
    spaceIndex,
  }) => {
    const { data, error } = await supabase.from("lyrics_content").insert([
      {
        user_id: userId,
        video_id: videoId,
        hiragana: hiragana,
        romaji: romaji,
        furigana: furigana,
        timestamp: timestamp,
        spaceIndex: spaceIndex,
      },
    ]);

    if (error) return { error };
    return { data };
  };

  //讀取指定歌曲內容
  const getSongContent = async ({ videoId, userId }) => {
    if (userId) {
      const { data, error } = await supabase
        .from("lyrics_content")
        .select()
        .eq("video_id", videoId)
        .eq("user_id", userId);

      if (error) return { error };
      return { data };
    } else {
      const { data, error } = await supabase
        .from("lyrics_content")
        .select()
        .eq("video_id", videoId);

      if (error) return { error };
      return { data };
    }
  };

  //讀取歌曲資訊
  const getSongInfo = async ({ videoId, userId }) => {
    if (userId) {
      const { data, error } = await supabase
        .from("lyrics_list")
        .select()
        .eq("video_id", videoId)
        .eq("user_id", userId);

      if (error) return { error };
      return { data };
    } else {
      const { data, error } = await supabase
        .from("lyrics_list")
        .select()
        .eq("video_id", videoId)
        .eq("recommend->state", true);

      if (error) return { error };
      return { data };
    }
  };

  //讀取[搜尋]目標歌曲列表
  const getSearchedSongList = async ({ userId, name }) => {
    const { data, count, error } = await supabase
      .from("lyrics_list")
      .select("*", { count: "exact" })
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .ilike("title", `%${name}%`)
      .range(0, 9);

    if (error) return { error };
    return { data, count };
  };

  //讀取[搜尋]推薦目標歌曲列表
  const getSearchedRecomSongList = async ({ name }) => {
    const { data, count, error } = await supabase
      .from("lyrics_list")
      .select("*", { count: "exact" })
      .eq("recommend->state", true)
      .order("created_at", { ascending: false })
      .ilike("title", `%${name}%`)
      .range(0, 9);

    if (error) return { error };
    return { data, count };
  };

  //刪除指定歌曲
  const deleteSong = async ({ videoId }) => {
    const { data, error } = await supabase
      .from("lyrics_list")
      .delete()
      .eq("video_id", videoId);

    if (error) return { error };
    return { data };
  };

  //刪除指定歌曲內容
  const deleteSongContent = async ({ videoId }) => {
    const { data, error } = await supabase
      .from("lyrics_content")
      .delete()
      .eq("video_id", videoId);
    if (error) return { error };
    return { data };
  };

  //歌曲換頁
  const handlePageChange = async ({ userId, from, to }) => {
    const { data, error } = await supabase
      .from("lyrics_list")
      .select()
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .range(from, to);
    if (error) return { error };
    return { data };
  };

  //推薦歌曲換頁
  const handleRecoPageChange = async ({ from, to }) => {
    const { data, error } = await supabase
      .from("lyrics_list")
      .select()
      .eq("recommend->state", true)
      .order("created_at", { ascending: false })
      .range(from, to);

    if (error) return { error };
    return { data };
  };

  //讀取歌曲列表
  const getSongList = async ({ userId }) => {
    const { data, count, error } = await supabase
      .from("lyrics_list")
      .select("*", { count: "exact" })
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .range(0, 9);

    if (error) return { error };
    return { data, count };
  };

  //讀取推薦歌曲列表
  const getRecoSongList = async () => {
    const { data, count, error } = await supabase
      .from("lyrics_list")
      .select("*", { count: "exact" })
      .eq("recommend->state", true)
      .order("created_at", { ascending: false })
      .range(0, 9);

    if (error) return { error };
    return { data, count };
  };

  return {
    handleSignup,
    handleLogin,
    handleLogout,
    sendPasswordResetEmail,
    handlePasswordReset,
    handleFeedBack,
    handleSongRecommendUpdate,
    handleSongContentUpdate,
    handleSongInfoAdd,
    handleSongContentAdd,
    getSongContent,
    getSongInfo,
    getSearchedSongList,
    getSearchedRecomSongList,
    deleteSong,
    deleteSongContent,
    handlePageChange,
    handleRecoPageChange,
    getSongList,
    getRecoSongList,
  };
});
