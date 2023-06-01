<template>
  <section>
    <atmos-dialog
    :show="isError"
    :title="errorMsg"
    @close="showDialog"
  />
    <div class="container mx-auto">
      <div class="flex items-center justify-center mt-6">
        <a
          href="/login"
          class="w-1/3 pb-4 font-medium text-center text-gray-500 capitalize border-b"
          :class="[isLoginPage ? isLoginClass : '']"
        >
          登入
        </a>
        <a
          href="/signup"
          class="w-1/3 pb-4 font-medium text-center text-gray-600 capitalize border-b"
          :class="[!isLoginPage ? isLoginClass : '']"
        >
          註冊
        </a>
      </div>
      <atmos-form
        :schema="formSchema[formType]"
        :validate="validate[formType]"
        @submit="handleSubmit"
      ></atmos-form>
    </div>
  </section>
</template>

<script setup>
import { ref, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useAuthStore } from "../../stores/auth";
import AtmosForm from "../atmos/AtmosForm.vue";
import * as Yup from "yup";
import UserIcon from "../svg/UserIcon.vue";
import PasswordIcon from "../svg/PasswordIcon.vue";
import EmailIcon from "../svg/EmailIcon.vue";
import GenderIcon from "../svg/GenderIcon.vue";
import PaperIcon from "../svg/PaperIcon.vue";
import CalenderIconVue from "../svg/CalenderIcon.vue";
import AtmosDialog from '../atmos/AtmosDialog.vue';

const isLoginClass = ref("border-b-2 border-[#46b0dd] text-white");
const isLoginPage = computed(() => {
  return route.path.indexOf("login") !== -1;
});

const formSchema = {
  login: [
    {
      name: "email",
      as: "input",
      placeholder: "請輸入信箱",
      icon: EmailIcon,
    },
    {
      name: "password",
      as: "input",
      type: "password",
      placeholder: "請輸入密碼",
      icon: PasswordIcon,
    },
  ],
  signup: [
    {
      name: "name",
      as: "input",
      placeholder: "請輸入使用者名稱",
      icon: UserIcon,
    },
    {
      name: "birth",
      as: "input",
      type: "date",
      icon: CalenderIconVue,
    },
    {
      name: "gender",
      as: "select",
      icon: GenderIcon,
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
      icon: PaperIcon,
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
      icon: EmailIcon,
    },
    {
      name: "password",
      as: "input",
      type: "password",
      placeholder: "請輸入密碼",
      icon: PasswordIcon,
    },
    {
      name: "confirmed",
      as: "input",
      type: "password",
      placeholder: "請再次輸入密碼",
      icon: PasswordIcon,
    },
  ],
};

const validate = {
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
};

const route = useRoute();
const router = useRouter();

const formType = computed(() => {
  return route.path.replace("/", "");
});

const { handleLogin,handleSignup } = useAuthStore();

const isError = ref(false);
const errorMsg = ref('');

function showDialog(value){
  isError.value = value ? true : false;
}
async function handleSubmit(value) {
  if (formType.value === "login") {
    await handleLogin(value.info);
    router.push('/songlist');
  } else {
    const result = await handleSignup(value.info);

  }
}
</script>