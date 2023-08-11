import { ref, computed } from "vue";
import { defineStore } from "pinia";
import { useGlobalStore } from "../index";
import useSupabase from "../supabase";
import * as Yup from "yup";

export const useAuthStore = defineStore("auth", () => {
  const { supabase } = useSupabase();
  const { loadingState } = useGlobalStore();

  const userInfo = ref("");

  function isLoggedIn() {
    return !!userInfo.value;
  }

  const feedbackName = computed(() => {
    return isLoggedIn() ? userInfo.value.user_metadata?.name : "";
  });
  //登入及註冊時的表單內容
  const formSchema = ref({
    login: [
      {
        name: "email",
        as: "input",
        placeholder: "請輸入信箱",
        icon: "EmailIcon",
      },
      {
        name: "password",
        as: "input",
        type: "password",
        placeholder: "請輸入密碼",
        icon: "PasswordIcon",
        icon2: "EyeCloseIcon"
      },
    ],
    signup: [
      {
        name: "name",
        as: "input",
        placeholder: "請輸入使用者名稱",
        icon: "UserIcon",
      },
      {
        name: "birth",
        as: "input",
        type: "date",
        icon: "CalenderIcon",
      },
      {
        name: "gender",
        as: "select",
        icon: "GenderIcon",
        children: [
          {
            tag: "option",
            value: "",
            text: "請選擇性別",
            disabled: true,
          },
          {
            tag: "option",
            value: "male",
            text: "男",
          },
          {
            tag: "option",
            value: "female",
            text: "女",
          },
        ],
      },
      {
        name: "level",
        as: "select",
        icon: "PaperIcon",
        children: [
          {
            tag: "option",
            value: "",
            text: "請選擇日本語能力",
            disabled: true,
          },
          {
            tag: "option",
            value: "none",
            text: "無",
          },
          {
            tag: "option",
            value: "N1",
            text: "N1",
          },
          {
            tag: "option",
            value: "N2",
            text: "N2",
          },
          {
            tag: "option",
            value: "N3",
            text: "N3",
          },
          {
            tag: "option",
            value: "N4",
            text: "N4",
          },
          {
            tag: "option",
            value: "N5",
            text: "N5",
          },
        ],
      },
      {
        name: "email",
        as: "input",
        placeholder: "請輸入信箱",
        icon: "EmailIcon",
      },
      {
        name: "password",
        as: "input",
        type: "password",
        placeholder: "請輸入密碼",
        icon: "PasswordIcon",
        icon2: "EyeCloseIcon"

      },
      {
        name: "confirmed",
        as: "input",
        type: "password",
        placeholder: "請再次輸入密碼",
        icon: "PasswordIcon",
        icon2: "EyeCloseIcon"
      },
    ],
    feedback: [
      {
        name: "name",
        as: "input",
        value: feedbackName,
        placeholder: "請輸入使用者名稱",
        icon: "UserIcon",
      },
      {
        name: "questionType",
        as: "select",
        icon: "PaperIcon",
        children: [
          {
            tag: "option",
            value: "",
            text: "請選擇問題類型",
            disabled: true,
          },
          {
            tag: "option",
            value: "operating",
            text: "網站操作流程",
          },
          {
            tag: "option",
            value: "webUI",
            text: "網站排版樣式",
          },
          {
            tag: "option",
            value: "other",
            text: "其他",
          },
        ],
      },
      {
        name: "feedbackText",
        as: "textarea",
        placeholder: "請輸入意見或回饋",
      },
    ],
    forgetPassword:[
      {
        name: "email",
        as: "input",
        placeholder: "請輸入信箱",
        icon: "EmailIcon",
      }
    ]
  });

  //驗證表單內容
  const validate = ref({
    login: Yup.object({
      email: Yup.string().email("信箱格式錯誤").required("請輸入信箱"),
      password: Yup.string()
        .required("請輸入密碼")
        .min(6, "至少輸入 6 個字")
        .max(20, "最多輸入 20 個字"),
    }),
    signup: Yup.object({
      name: Yup.string()
        .min(2, "請輸入兩字以上名稱")
        .max(15, "最多輸入 15 個字")
        .required("請輸入使用者名稱"),
      birth: Yup.string().required("請選擇出生年月日"),
      gender: Yup.string().required("請選擇性別"),
      level: Yup.string().required("請選擇日本語能力"),
      email: Yup.string().email("信箱格式錯誤").required("請輸入信箱"),
      password: Yup.string()
        .required("請輸入密碼")
        .min(6, "至少輸入 6 個字")
        .max(20, "最多輸入 20 個字"),
      confirmed: Yup.string()
        .oneOf([Yup.ref("password"), null], "密碼不相符")
        .required("請再次輸入密碼"),
    }),
    feedback: Yup.object({
      name: Yup.string()
        .min(2, "請輸入兩字以上名稱")
        .max(15, "最多輸入 15 個字")
        .required("請輸入使用者名稱"),
      questionType: Yup.string().required("請選擇問題類型"),
      feedbackText: Yup.string()
        .required("請輸入意見或回饋")
        .min(2, "至少輸入 2 個字")
        .max(300, "最多輸入 300 個字"),
    }),
    forgetPassword:Yup.object({
      name: Yup.string().email("信箱格式錯誤").required("請輸入信箱"),
    }),
  });

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
      return { message: "success", data: data };
    } catch (error) {
      if (error instanceof Error) {
        return { message: "error", data: error };
      }
    } finally {
      loadingState(false);
    }
  };

  const handleLogin = async (info) => {
    try {
      loadingState(true);

      const { data, error } = await supabase.auth.signInWithPassword({
        email: info.email,
        password: info.password,
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
  };

  const handleLogout = async () => {
    try {
      loadingState(true);
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      return { message: "success" };
    } catch (error) {
      if (error instanceof Error) {
        return error;
      }
    } finally {
      loadingState(false);
    }
  };

  const handleFeedBack = async (info) => {
    try {
      loadingState(true);
      const { data, error } = await supabase.from("feedback").insert([
        {
          user_name: info.name,
          question_type: info.questionType,
          text: info.feedbackText,
        },
      ]);
      if (error) throw error;
      return { message: "success", data: data };
    } catch (error) {
      if (error instanceof Error) {
        return { message: "error", data: error };
      }
    } finally {
      loadingState(false);
    }
  };

  return {
    formSchema,
    validate,
    userInfo,
    isLoggedIn,
    handleLogin,
    handleSignup,
    handleLogout,
    handleFeedBack,
  };
});
