<template>
  <aside
    class="flex flex-col max-sm:w-full w-64 h-screen px-5 py-8 overflow-y-auto bg-gray-900"
  >
    <div class="flex flex-col justify-between flex-1 mt-6">
      <nav class="flex-1 -mx-3 space-y-3">
        <router-link
          class="flex items-center px-3 py-2 text-gray-600 transition-colors duration-300 transform rounded-lg dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 dark:hover:text-gray-200 hover:text-gray-700"
          :class="{ 'bg-slate-500': route.path.indexOf('search') > 0 }"
          to="/song/search"
        >
          <HomePageIcon />
          <span class="mx-2 text-sm font-medium">首頁</span>
        </router-link>

        <router-link
          class="flex items-center px-3 py-2 text-gray-600 transition-colors duration-300 transform rounded-lg dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 dark:hover:text-gray-200 hover:text-gray-700"
          :class="{ 'bg-slate-500': route.path.indexOf('upload') > 0 }"
          to="/song/upload"
        >
          <plus-paper-icon />
          <span class="mx-2 text-sm font-medium">新增歌曲</span>
        </router-link>

        <router-link
          class="flex items-center px-3 py-2 text-gray-600 transition-colors duration-300 transform rounded-lg dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 dark:hover:text-gray-200 hover:text-gray-700"
          :class="{ 'bg-slate-500': route.path.indexOf('personal') > 0 }"
          to="/song/personal/list"
        >
          <paper-icon />
          <span class="mx-2 text-sm font-medium">個人清單</span>
        </router-link>

        <router-link
          class="flex items-center px-3 py-2 text-gray-600 transition-colors duration-300 transform rounded-lg dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 dark:hover:text-gray-200 hover:text-gray-700"
          :class="{ 'bg-slate-500': route.path.indexOf('recommend') > 0 }"
          to="/song/recommend/list"
        >
          <recommend-icon />
          <span class="mx-2 text-sm font-medium">推薦清單</span>
        </router-link>
        <router-link
          to="/feedback"
          class="flex items-center px-3 py-2 text-gray-600 transition-colors duration-300 transform rounded-lg dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 dark:hover:text-gray-200 hover:text-gray-700"
          :class="{ 'bg-slate-500': route.path.indexOf('feedback') > 0 }"
        >
          <fillin-icon />
          <span class="mx-2 text-sm font-medium"> 意見回饋 </span>
        </router-link>

        <router-link
          to="/about"
          class="flex items-center px-3 py-2 text-gray-600 transition-colors duration-300 transform rounded-lg dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 dark:hover:text-gray-200 hover:text-gray-700"
          :class="{ 'bg-slate-500': route.path.indexOf('about') > 0 }"
        >
          <info-icon />
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
import { useRoute, useRouter } from "vue-router";
import { storeToRefs } from "pinia";
import { useAuthStore } from "../../stores/auth";
import { useApiStore } from "../../stores/api";
import { useRequestStore } from "../../stores/request";

import InfoIcon from "../svg/InfoIcon.vue";
import LogoutIcon from "../svg/LogoutIcon.vue";
import SigninButton from "../svg/SigninButton.vue";
import RecommendIcon from "../svg/RecommendIcon.vue";
import UserIcon from "../svg/UserIcon.vue";
import PaperIcon from "../svg/PaperIcon.vue";
import PlusPaperIcon from "../svg/PlusPaperIcon.vue";
import FillinIcon from "../svg/FillinIcon.vue";
import HomePageIcon from "../svg/HomePageIcon.vue";

const { isLoggedIn } = useAuthStore();
const { userInfo } = storeToRefs(useAuthStore());

const { supabaseRequest } = useRequestStore();
const { handleLogout } = useApiStore();

const route = useRoute();
const router = useRouter();
async function logout() {
  await supabaseRequest(handleLogout);
  router.push({ path: "/login" }).then(() => {
    router.go();
  });
}

const loggedIn = computed(() => {
  return isLoggedIn();
});
</script>
