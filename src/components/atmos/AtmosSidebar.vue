<template>
  <aside
    class="flex flex-col w-64 h-screen px-5 py-8 overflow-y-auto bg-white border-r rtl:border-r-0 rtl:border-l dark:bg-gray-900 dark:border-gray-700"
  >
    <div class="flex flex-col justify-between flex-1 mt-6">
      <nav class="flex-1 -mx-3 space-y-3">
        <a
          class="flex items-center px-3 py-2 text-gray-600 transition-colors duration-300 transform rounded-lg dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 dark:hover:text-gray-200 hover:text-gray-700"
          href="/song/search"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="w-5 h-5"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
            />
          </svg>

          <span class="mx-2 text-sm font-medium">首頁</span>
        </a>

        <a
          class="flex items-center px-3 py-2 text-gray-600 transition-colors duration-300 transform rounded-lg dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 dark:hover:text-gray-200 hover:text-gray-700"
          href="/song/upload"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="w-6 h-6"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m3.75 9v6m3-3H9m1.5-12H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
            />
          </svg>

          <span class="mx-2 text-sm font-medium">新增歌曲頁</span>
        </a>

        <a
          class="flex items-center px-3 py-2 text-gray-600 transition-colors duration-300 transform rounded-lg dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 dark:hover:text-gray-200 hover:text-gray-700"
          href="/song/list"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="w-6 h-6"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
            />
          </svg>

          <span class="mx-2 text-sm font-medium">已建立歌曲清單</span>
        </a>
         <router-link
          to="/about"
          class="flex items-center px-3 py-2 text-gray-600 transition-colors duration-300 transform rounded-lg dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 dark:hover:text-gray-200 hover:text-gray-700"
        >
         <info-icon/>
          <span class="mx-2 text-sm font-medium"> 關於網站 </span>
        </router-link>
      </nav>

      <div>
        <div v-if="userInfo.user_metadata?.name" class="flex">
          <user-icon class="mx-0 mr-2" />
          {{ userInfo.user_metadata?.name }}
        </div>
      </div>
      <div class="mt-1 -mx-3">
        <div
          class="flex items-center justify-between mt-1 transition-colors duration-300 transform rounded-lg px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 dark:hover:text-gray-200 hover:text-gray-700 cursor-pointer"
        >
          <a
            v-if="!loggedIn"
            href="/login"
            class="flex items-center gap-x-2 w-full"
          >
            <span class="text-sm font-medium text-gray-700 dark:text-gray-200"
              >登入</span
            >
            <signin-button class="text-gray-400 rotate-180" />
          </a>
          <div
            v-else
            @click="logout"
            class="w-full cursor-pointer flex items-center"
          >
            <logout-icon class="text-gray-400 rotate-180" />
            <span class="mx-1">登出</span>
          </div>
        </div>
      </div>
    </div>
  </aside>
</template>

<script setup>
import { computed } from "vue";
import { useRouter } from "vue-router";
import { storeToRefs } from "pinia";
import { useAuthStore } from "../../stores/auth";

import InfoIcon from "../svg/InfoIcon.vue";
import LogoutIcon from "../svg/LogoutIcon.vue";
import SigninButton from "../svg/SigninButton.vue";
import UserIcon from "../svg/UserIcon.vue";

const { handleLogout, isLoggedIn } = useAuthStore();
const { userInfo } = storeToRefs(useAuthStore());

const router = useRouter();
async function logout() {
  const result = await handleLogout();
  router.push({ path: "/login" }).then(() => {
    router.go();
  });
}

const loggedIn = computed(() => {
  return isLoggedIn();
});
</script>
