import { ref, computed } from "vue";
import { defineStore } from "pinia";
import * as Yup from "yup";

export const useAuthStore = defineStore("auth", () => {
  //會員資訊
  const userInfo = ref("");
  //判斷是否登入
  function isLoggedIn() {
    return !!userInfo.value;
  }
  //回饋表單姓名自動帶入會員名稱
  const feedbackName = computed(() => {
    return isLoggedIn() ? userInfo.value.user_metadata?.name : "";
  });
  
  //登入及註冊時的表單內容
  const formSchema = ref({
    login: {
      email: {
        name: "email",
        as: "input",
        placeholder: "請輸入信箱",
        icon: "EmailIcon",
      },
      password: {
        name: "password",
        as: "input",
        type: "password",
        placeholder: "請輸入密碼",
        autocomplete:true,
        icon: "PasswordIcon",
        icon2: "EyeCloseIcon"
      },
    },
    signup: {
      userName: {
        name: "name",
        as: "input",
        placeholder: "請輸入使用者名稱",
        icon: "UserIcon",
      },
      birth: {
        name: "birth",
        as: "input",
        type: "date",
        icon: "CalenderIcon",
      },
      gender: {
        name: "gender",
        as: "select",
        icon: "GenderIcon",
        icon2: "ChervonDownIcon",
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
      level: {
        name: "level",
        as: "select",
        icon: "PaperIcon",
        icon2: "ChervonDownIcon",
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
      email: {
        name: "email",
        as: "input",
        placeholder: "請輸入信箱",
        icon: "EmailIcon",
      },
      password: {
        name: "password",
        as: "input",
        type: "password",
        placeholder: "請輸入密碼",
        autocomplete:false,
        icon: "PasswordIcon",
        icon2: "EyeCloseIcon"

      },
      passwordConfirmed: {
        name: "passwordConfirmed",
        as: "input",
        type: "password",
        placeholder: "請再次輸入密碼",
        autocomplete:false,
        icon: "PasswordIcon",
        icon2: "EyeCloseIcon"
      },
    },
    feedback: {
      name: {
        name: "name",
        as: "input",
        value: feedbackName,
        placeholder: "請輸入使用者名稱",
        icon: "UserIcon",
      },
      questionType: {
        name: "questionType",
        as: "select",
        icon: "PaperIcon",
        icon2: "ChervonDownIcon",
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
      feedbackText: {
        name: "feedbackText",
        as: "textarea",
        placeholder: "請輸入意見或回饋",
      },
    },
    passwordForget: {
      email: {
        name: "email",
        as: "input",
        placeholder: "請輸入信箱",
        icon: "EmailIcon",
      }
    },
    passwordUpdate: {
      password: {
        name: "password",
        as: "input",
        type: "password",
        placeholder: "請輸入新密碼",
        icon: "PasswordIcon",
        icon2: "EyeCloseIcon"

      },
      passwordConfirmed: {
        name: "passwordConfirmed",
        as: "input",
        type: "password",
        placeholder: "請再次輸入新密碼",
        icon: "PasswordIcon",
        icon2: "EyeCloseIcon"
      },
    }
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
      passwordConfirmed: Yup.string()
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
    passwordForget: Yup.object({
      email: Yup.string().email("信箱格式錯誤").required("請輸入信箱"),
    }),
    passwordUpdate: Yup.object({
      password: Yup.string()
        .required("請輸入密碼")
        .min(6, "至少輸入 6 個字")
        .max(20, "最多輸入 20 個字"),
      passwordConfirmed: Yup.string()
        .oneOf([Yup.ref("password"), null], "密碼不相符")
        .required("請再次輸入密碼"),
    }),
  });

  return {
    userInfo,
    formSchema,
    validate,
    isLoggedIn
  };
});
