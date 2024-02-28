import { createRouter, createWebHistory } from "vue-router";
import { useSupabase } from "../composables/useSupabase";
import HomePage from "@/pages/Home/Index.vue";

import SongEdit from "@/pages/Song/SongEdit.vue";
import PersonalSongList from "@/pages/PersonalSongList/Index.vue";
import RecommendSongList from "@/pages/RecommendSongList/Index.vue";
import SongItem from "@/pages/Song/SongItem.vue";

import AuthPage from "@/pages/Auth/Index.vue";
import OnboardingPage from "@/pages/Auth/OnboardingPage.vue";
import PasswordForget from "@/pages/Auth/PasswordForget.vue";
import PasswordUpdate from "@/pages/Auth/PasswordUpdate.vue";

import AboutPage from "@/pages/About/Index.vue";
import FeedBackPage from "@/pages/FeedBack/Index.vue";

// import NotFound from './pages/NotFound.vue';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/KAKUKAKU/song",
      children: [
        {
          path: "search",
          component: HomePage,
          meta: {
            title: "KAKUKAKU｜一鍵平假名，輕鬆學日文歌",
          },
        },
        {
          path: "upload",
          component: SongEdit,
          meta: {
            title: "新增歌曲｜KAKUKAKU",
          },
        },
        {
          path: "personal/list",
          component: PersonalSongList,
          meta: {
            title: "個人清單｜KAKUKAKU",
          },
        },
        {
          path: "recommend/list",
          component: RecommendSongList,
          meta: {
            title: "推薦清單｜KAKUKAKU",
          },
        },
        {
          path: "item",
          component: SongItem,
          meta: {
            title: "歌曲｜KAKUKAKU",
          },
        },
      ],
    },
    {
      path: "/KAKUKAKU/login",
      component: AuthPage,
      meta: {
        title: "登入會員｜KAKUKAKU",
      },
    },
    {
      path: "/KAKUKAKU/signup",
      component: AuthPage,
      meta: {
        title: "註冊會員｜KAKUKAKU",
      },
    },

    {
      path: "/KAKUKAKU/account",
      children: [
        {
          path: "forget-password",
          component: PasswordForget,
          meta: {
            title: "忘記密碼｜KAKUKAKU",
          },
        },
        {
          path: "update-password",
          component: PasswordUpdate,
          meta: {
            title: "更新密碼｜KAKUKAKU",
          },
        },
        {
          path: "onboarding",
          component: OnboardingPage,
          meta: {
            title: "驗證會員｜KAKUKAKU",
          },
        },
        {
          path: "register-success",
          component: OnboardingPage,
          meta: {
            title: "註冊成功｜KAKUKAKU",
          },
        },
      ],
    },
    {
      path: "/KAKUKAKU/about",
      component: AboutPage,
      meta: {
        title: "關於網站｜KAKUKAKU",
      },
    },
    {
      path: "/KAKUKAKU/feedback",
      component: FeedBackPage,
      meta: {
        title: "意見回饋｜KAKUKAKU",
      },
    },
    { path: "/:notFound(.*)", redirect: "/KAKUKAKU/song/search" },
  ],
});

router.beforeEach(async (to, from) => {
  const { supabase } = useSupabase();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (to.meta.title) {
    document.title = to.meta.title;
  }
  if (to.path.indexOf('item') > 0 && to.query.song_id) {
    const res = await supabase
      .from("lyrics_list")
      .select()
      .eq("video_id", to.query.song_id);
    if (res?.data) {
      document.title = res?.data[0]?.title + '｜KAKUKAKU';
    }
  }

  if (to.fullPath.indexOf("login") > -1 || to.fullPath.indexOf("signup") > -1) {
    if (session?.user) return "/KAKUKAKU/song/search";
  }

  return true;
});

export default router;
