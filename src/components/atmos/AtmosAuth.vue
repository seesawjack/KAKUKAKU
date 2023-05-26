<template>
  <section>
    <atmos-dialog :show="isError" :title="errorMessage" @close="showDialog" />
    <div class="container flex items-center justify-center px-6 mx-auto">
      <form class="w-full max-w-md" @submit.prevent="sendAuth">
        <!-- sign in & sign up href -->
        <div class="flex items-center justify-center mt-6">
          <a
            href="/signin"
            class="w-1/3 pb-4 font-medium text-center text-gray-500 capitalize border-b"
            :class="[isSigninpage ? isSigninClass : '']"
          >
            登入
          </a>

          <a
            href="/signup"
            class="w-1/3 pb-4 font-medium text-center text-gray-600 capitalize border-b"
            :class="[!isSigninpage ? isSigninClass : '']"
          >
            註冊
          </a>
        </div>
        <!-- 輸入框群組 -->
        <slot name="input"></slot>
        <!-- 按鈕群組 -->
        <slot name="button"></slot>
      </form>
    </div>
  </section>
</template>

<script setup>
import { ref, reactive, computed } from "vue";
import { useRoute } from "vue-router";
import { useAuthStore } from "../../stores/auth";
import { useRegexStore } from "../../stores/regex";
import AtmosDialog from "../atmos/AtmosDialog.vue";

const route = useRoute();
const { passwordRegex } = useRegexStore();
const {
  formInfo: { signin, signup, custom },
  supabase,
} = useAuthStore();

const isSigninClass = ref("border-b-2 border-blue-500 text-white");
const isSigninpage = computed(() => {
  return route.path.indexOf("signin") !== -1;
});

const isError = ref(false);
const errorMessage = ref("");

function showDialog(value) {
  isError.value = value ? true : false;
}

async function sendAuth() {
  if (isSigninpage.value) {
    const signinInfo = {
      email: signin.email.value,
      password: signin.password.value,
    };

    for (const [key, value] of Object.entries(signinInfo)) {
      if (!value) {
        isError.value = true;
        errorMessage.value = "帳號或密碼未填寫";
        return;
      }
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email: signin.email.value,
      password: signin.password.value,
    });

    console.log("%c 結果(藍) ", "background: #009393; color: #ffffff", data);
    console.log("%c 結果(紅) ", "background: #EA0000; color: #ffffff", error);
  } else {
    const signupInfo = {
      name: signup.name.value,
      email: signup.email.value,
      password: signup.password.value,
      checkPassword: signup.checkPassword.value,
      birth: custom.birth,
      gender: custom.gender,
      level: custom.level,
    };

    for (const [key, value] of Object.entries(signupInfo)) {
      if (!value) {
        isError.value = true;
        const inputName = {
          ...signup,
          birth: { tips: "生日" },
          gender: { tips: "性別" },
          level: { tips: "日本語能力" },
        };
        errorMessage.value = `「${inputName[key].tips}」欄位沒有填寫`;
        return;
      }

      if (key === "checkPassword") {
        if (signupInfo.password !== value) {
          isError.value = true;
          errorMessage.value = "兩次密碼不相符";
          return;
        }
      }
    }

    const { data, error } = await supabase.auth.signUp({
      email: signup.email.value,
      password: signup.password.value,
      options: {
        data: {
          birth: custom.birth,
          gender: custom.gender,
          level: custom.level,
          emailRedirectTo: "http://localhost:5173/",
        },
      },
    });
    console.log("%c 結果(紅) ", "background: #EA0000; color: #ffffff", error);
    console.log("%c 結果(藍) ", "background: #009393; color: #ffffff", data);
  }
}
</script>
