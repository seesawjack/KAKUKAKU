import { createClient } from "@supabase/supabase-js";
import { useGlobalStore } from "../stores/index";

export function useSupabase() {
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const supabaseKey = import.meta.env.VITE_SUPABASE_KEY;
  const supabase = createClient(supabaseUrl, supabaseKey);
  const { isError, loadingState } = useGlobalStore();


  const sbRequest = async (func, meta) => {
    try {
      const { data, count = 0, error } = await func(meta);
      if (error) throw error;
      return { data, count };
    } catch (error) {
      console.error(error.message)
    } finally {
    }
  };

  //註冊
  const handleSignup = async ({ email, password, ...meta }) => {
    const { data, error } = await supabase.auth.signUp({
      email: email,
      password: password,
      options: {
        data: {
          ...meta,
        },
        emailRedirectTo: "http://localhost:5173/account/register-success",
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

  //單一歌曲影片更新
  const handleVideoUpdate = async ({ id, videoId, img, userId }) => {
    const { data, error } = await supabase
      .from("lyrics_list")
      .update({ video_id: videoId, video_img: img })
      .eq("id", id)
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
    id,
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
        video_id: videoId,
      })
      .eq("id", id)
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
  const getSongContent = async ({ videoId }) => {
    try {
      const { data, error } = await supabase
        .from("lyrics_content")
        .select()
        .eq("video_id", videoId)
      if (error) {
        throw error
      };
      return { data };
    } catch (error) {
      console.log(error);
    }
  };

  //取得歌曲資訊
  const getSongInfo = async ({ videoId, userId }) => {
    try {
      const { data, error } = await supabase
        .from("lyrics_list")
        .select()
        .eq("video_id", videoId)
        .eq("user_id", userId);

      if (error) {
        console.log(error)
        throw error
      };
      return { data };
    } catch (error) {
      console.error('API: getSongInfo: \n' + error.message);
    }
  };

  //取得推薦歌曲資訊
  const getRecommendSongInfo = async ({ videoId }) => {
    try {
      const { data, error } = await supabase
        .from("lyrics_list")
        .select()
        .eq("video_id", videoId)
        .eq("recommend->state", true);

      if (error) {
        throw error
      };
      return { data };
    } catch (error) {
      console.log(error);
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
    supabase,
    sbRequest,
    handleSignup,
    handleLogin,
    handleLogout,
    sendPasswordResetEmail,
    handlePasswordReset,
    handleFeedBack,
    handleSongRecommendUpdate,
    handleSongContentUpdate,
    handleVideoUpdate,
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
}
