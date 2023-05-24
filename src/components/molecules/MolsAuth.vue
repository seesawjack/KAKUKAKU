<template>
  <atmos-auth>
    <template #input>
      <atmos-input
        v-for="(item, key) in formInfo.signin"
        :key="key"
        :inputClass="'block w-full py-3 text-gray-700 bg-white border rounded-lg pl-11 dark:bg-gray-900 dark:text-gray-300 dark:border-gray-600 focus:border-blue-400 dark:focus:border-blue-300 focus:ring-blue-300 focus:outline-none focus:ring focus:ring-opacity-40 mt-8'"
        :inputTips="item.tips"
        v-model="item.value"
      >
        <component :is="iconType[item.icon]" class="absolute top-3"></component>
      </atmos-input>
    </template>
    <template #button>
      <div class="mt-6">
        <button
          class="w-full px-6 py-3 text-sm font-medium tracking-wide text-white capitalize transition-colors duration-300 transform bg-blue-500 rounded-lg hover:bg-blue-400 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-50"
        >
          登入
        </button>

        <div class="mt-6 text-center">
          <a
            href="#"
            class="text-sm text-blue-500 hover:underline dark:text-blue-400"
          >
           還沒有申請帳號嗎?點擊跳轉到註冊頁
          </a>
        </div>
      </div>
    </template>
  </atmos-auth>
</template>

<script setup>
import { ref } from "vue";
import { useAuthStore } from "../../stores/auth";
import AtmosAuth from "../atmos/AtmosAuth.vue";
import AtmosInput from "../atmos/AtmosInput.vue";
import UserIcon from "../svg/UserIcon.vue";
import PasswordIcon from "../svg/PasswordIcon.vue";
import EmailIcon from "../svg/EmailIcon.vue";

const { formInfo } = useAuthStore();
const iconType = {
  UserIcon,
  PasswordIcon,
  EmailIcon
}
const test = ref("");
</script>