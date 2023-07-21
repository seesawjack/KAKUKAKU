<template>
  <section>
    <atmos-dialog :show="errorMessage?.showError" :title="errorMessage?.message" @close="closeDialog" />
    <div class="container mx-auto">
      <div class="flex items-center justify-center mt-6">
        <a href="/login" class="w-1/3 pb-4 font-medium text-center text-gray-500 capitalize border-b"
          :class="{ 'atThisTab': atLoginPage === 'login' }">
          登入
        </a>
        <a href="/signup" class="w-1/3 pb-4 font-medium text-center text-gray-600 capitalize border-b "
          :class="{ 'atThisTab': atLoginPage === 'signup' }">
          註冊
        </a>
      </div>
      <atmos-form :schema="formSchema[atLoginPage]" :validate="validate[atLoginPage]" @submit="handleSubmit"></atmos-form>
    </div>
  </section>
</template>

<script setup>
import { computed,toRefs } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useAuthStore } from "../../stores/auth";
import { useGlobalStore } from "../../stores";

import AtmosForm from "../atmos/AtmosForm.vue";
import AtmosDialog from "../atmos/AtmosDialog.vue";

const route = useRoute();
const router = useRouter();
const { formSchema, validate, handleLogin, handleSignup } = useAuthStore();
const { isError } = useGlobalStore();
const { errorMessage } = toRefs(useGlobalStore());


//判斷目前在「登入」或「註冊」Tab
const atLoginPage = computed(() => {
  return route.path.indexOf("login") > -1 ? 'login' : 'signup';
});


function closeDialog() {
  isError({ showError: false, message: '' });
}

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

<style scoped>
.atThisTab {
  border-bottom-width: 2px;
  --tw-border-opacity: 1;
  border-color: rgb(70 176 221 / var(--tw-border-opacity));
  color: rgb(255 255 255 / var(--tw-text-opacity));
}
</style>