<template>
  <section>
    <div class="container mx-auto">
      <div class="flex items-center justify-center mt-6">
        <a href="/login" class="w-1/3 pb-4 font-medium text-center text-gray-500 text-xl capitalize border-b"
          :class="{ 'border-sky-400 text-white': atLoginPage === 'login' }">
          登入
        </a>
        <a href="/signup" class="w-1/3 pb-4 font-medium text-center text-xl  text-gray-600 capitalize border-b "
          :class="{ 'border-sky-400 text-white': atLoginPage === 'signup' }">
          註冊
        </a>
      </div>
      <atmos-form :form-type="atLoginPage" :schema="formSchema[atLoginPage]" :validate="validate[atLoginPage]" :button="buttonState" @submit="handleSubmit"></atmos-form>
    </div>
    <div class="mt-5" v-if="atLoginPage === 'login'">
      <router-link to="/account/forget-password" class="hover:text-sky-400">忘記密碼</router-link>
      <span class="mx-3">|</span>
      <router-link to="/signup" class="hover:text-sky-400">新會員註冊</router-link>
      </div>
  </section>
</template>

<script setup>
import { computed,toRefs } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useAuthStore } from "../../stores/auth";
import { useGlobalStore } from "../../stores";

import AtmosForm from "../atmos/AtmosForm.vue";

const route = useRoute();
const router = useRouter();
const { formSchema, validate, handleLogin, handleSignup } = useAuthStore();
const { isError } = useGlobalStore();


//判斷目前在「登入」或「註冊」Tab
const atLoginPage = computed(() => {
  return route.path.indexOf("login") > -1 ? 'login' : 'signup';
});

const buttonState = computed(()=>{
  return route.path.indexOf("login") > -1 ? { state: true, name: "登入" }
    : { state: true, name: "下一步" };

})


//送出「登入」或「註冊」事件
async function handleSubmit(form) {
  if (atLoginPage.value === "login") {
    const result = await handleLogin(form.info);
    if (result.message === "success") {
      router.back();
    } else {
      isError({ showError: true, message: result.data.toString() });
    }
  } else {
    const result = await handleSignup(form.info);
    if (result.message === "success") {
      router.push("/onboarding");
    } else {
      isError({ showError: true, message: result.data.toString() });
    }
  }
}
</script>