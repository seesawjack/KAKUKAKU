<template>
  <section>
    <div class="container mx-auto">
      <div class="flex items-center justify-center mt-6">
        <a
          href="/login"
          class="w-1/3 pb-4 font-medium text-center text-gray-500 text-3xl capitalize border-b"
          :class="{ 'border-sky-400 text-white': atLoginPage === 'login' }"
        >
          登入
        </a>
        <a
          href="/signup"
          class="w-1/3 pb-4 font-medium text-center text-3xl text-gray-600 capitalize border-b"
          :class="{ 'border-sky-400 text-white': atLoginPage === 'signup' }"
        >
          註冊
        </a>
      </div>
      <atmos-form
        :form-type="atLoginPage"
        :schema="formSchema[atLoginPage]"
        :validate="validate[atLoginPage]"
        :button="buttonState"
        @submit="handleSubmit"
      ></atmos-form>
    </div>
    <div class="mt-5" v-if="atLoginPage === 'login'">
      <router-link to="/account/forget-password" class="hover:text-sky-400"
        >忘記密碼</router-link
      >
      <span class="mx-3">|</span>
      <router-link to="/signup" class="hover:text-sky-400"
        >新會員註冊</router-link
      >
    </div>
  </section>
</template>

<script setup>
import { computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useAuthStore } from "../../stores/auth";
import { useApiStore } from "../../stores/api";
import { useRequestStore } from "../../stores/request";

import AtmosForm from "../atmos/AtmosForm.vue";

const route = useRoute();
const router = useRouter();

const { formSchema, validate } = useAuthStore();
const { supabaseRequest } = useRequestStore();
const { handleLogin, handleSignup } = useApiStore();

//判斷目前在「登入」或「註冊」Tab
const atLoginPage = computed(() => {
  return route.path.indexOf("login") > -1 ? "login" : "signup";
});

const buttonState = computed(() => {
  return route.path.indexOf("login") > -1
    ? { state: true, name: "登入" }
    : { state: true, name: "下一步" };
});

//送出「登入」或「註冊」事件
async function handleSubmit(form) {
  //登入事件
  if (atLoginPage.value === "login") {
    const result = await supabaseRequest(handleLogin, {
      email: form.info.email,
      password: form.info.password,
    });

    if (result !== undefined && result.session) router.back();
  } else {
    //註冊事件
    const result = await supabaseRequest(handleSignup, {
      email: form.info.email,
      password: form.info.password,
      name: form.info.name,
      birth: form.info.birth,
      gender: form.info.gender,
      level: form.info.level,
    });
    
    if (result !== undefined && result.user) router.push("/onboarding");
  }
}
</script>
