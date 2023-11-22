<template>
  <aside class="w-64 h-my-screen flex flex-col max-sm:w-full  px-5 py-8 overflow-y-auto bg-gray-900">
    <div class="h-full flex flex-col justify-between flex-1 mt-6">
      <nav class="flex-1 -mx-3 space-y-3">
        <router-link v-for="(item, index) in siteLinks" :key="index"
          class="flex items-center px-3 py-2 text-gray-600 transition-colors duration-300 transform rounded-lg dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 dark:hover:text-gray-200 hover:text-gray-700"
          :class="{ 'bg-slate-500': route.path.indexOf(item.path) > 0 }" :to="item.link" @click="closeSidebar">
          <atmos-svg-icon :name="item.icon" />
          <span class="mx-2 text-sm font-medium">{{ item.name }}</span>
        </router-link>
      </nav>

      <div>
        <div v-if="userInfo.user_metadata?.name" class="flex">
          <atmos-svg-icon name="icon_user" class="mx-0 mr-2" />
          {{ userInfo.user_metadata?.name }}
        </div>
      </div>
      <div class="mt-1 -mx-3">
        <div
          class="flex items-center justify-between mt-1 transition-colors duration-300 transform rounded-lg px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 dark:hover:text-gray-200 hover:text-gray-700 cursor-pointer">
          <a v-if="!loggedIn" href="/KAKUKAKU/login" class="flex items-center gap-x-2 w-full">
            <span class="text-sm font-medium text-gray-700 dark:text-gray-200">登入</span>
            <atmos-svg-icon name="icon_signin" class="text-gray-400 rotate-180"/>
          </a>
          <div v-else @click="logout" class="w-full cursor-pointer flex items-center">
            <atmos-svg-icon name="icon_logout" class="text-gray-400 rotate-180" />
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
import { useSupabase } from "../../composables/useSupabase";

import AtmosSvgIcon from "./AtmosSvgIcon.vue";

const { isLoggedIn } = useAuthStore();
const { userInfo } = storeToRefs(useAuthStore());

const { sbRequest,handleLogout } = useSupabase();

const route = useRoute();
const router = useRouter();

const emit = defineEmits(['closeSidebar'])

const siteLinks = [
  {
    name: "首頁",
    path: "search",
    link: "/KAKUKAKU/song/search",
    icon: "icon_home_page",
  },
  {
    name: "新增歌曲",
    path: "upload",
    link: "/KAKUKAKU/song/upload",
    icon: "icon_plus_paper",
  },
  {
    name: "個人清單",
    path: "personal",
    link: "/KAKUKAKU/song/personal/list",
    icon: "icon_paper",
  },
  {
    name: "推薦清單",
    path: "recommend",
    link: "/KAKUKAKU/song/recommend/list",
    icon: "icon_recommend",
  },
  {
    name: "意見回饋",
    path: "feedback",
    link: "/KAKUKAKU/feedback",
    icon: "icon_fillin",
  },
  { name: "關於網站", path: "about", link: "/KAKUKAKU/about", icon: "icon_info" },
];

const loggedIn = computed(() => {
  return isLoggedIn();
});

async function logout() {
  await sbRequest(handleLogout);
  router.push({ path: "/KAKUKAKU/login" }).then(() => {
    router.go();
  });
}

function closeSidebar() {
  emit('closeSidebar')
}
</script>
