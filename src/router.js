import { createRouter, createWebHistory } from "vue-router";
import { useRequestStore } from "./stores/request";
import HomePage from "./pages/Home/Index.vue";

import SongEdit from "./pages/Song/SongEdit.vue";
import SongList from "./pages/Song/SongList.vue";
import SongItem from "./pages/Song/SongItem.vue";

import AuthPage from "./pages/Auth/Index.vue";
import OnboardingPage from "./pages/Auth/OnboardingPage.vue";
import PasswordForget from "./pages/Auth/PasswordForget.vue";
import PasswordUpdate from "./pages/Auth/PasswordUpdate.vue";

import AboutPage from "./pages/About/Index.vue";
import FeedBackPage from "./pages/FeedBack/Index.vue";

// import NotFound from './pages/NotFound.vue';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/KAKUKAKU/song",
      children: [
        { path: "search", component: HomePage },
        { path: "upload", component: SongEdit },
        { path: "personal/list", component: SongList },
        { path: "recommend/list", component: SongList },
        { path: "item", component: SongItem },
      ],
    },
    { path: "/KAKUKAKU/login", component: AuthPage },
    { path: "/KAKUKAKU/signup", component: AuthPage },

    {
      path: "/KAKUKAKU/account",
      children: [
        {
          path: "forget-password",
          component: PasswordForget,
        },
        {
          path: "update-password",
          component: PasswordUpdate,
        },
        { path: "onboarding", component: OnboardingPage },
        { path: "register-success", component: OnboardingPage },
      ],
    },
    { path: "/KAKUKAKU/about", component: AboutPage },
    { path: "/KAKUKAKU/feedback", component: FeedBackPage },
    { path: "/:notFound(.*)", redirect: "/KAKUKAKU/song/search" },
  ],
});

router.beforeEach(async (to, from) => {
  const { supabase } = useRequestStore();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (to.fullPath.indexOf("login") > -1 || to.fullPath.indexOf("signup") > -1) {
    if (session?.user) return "/KAKUKAKU/song/search";
    return true;
  }
  return true;
});

export default router;
