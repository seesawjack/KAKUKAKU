import { createRouter, createWebHistory } from 'vue-router';

import HomePage from './pages/Home/Index.vue';
import LyricsEdit from './pages/Lyrics/LyricsEdit.vue';
import LyricsResult from './pages/Lyrics/LyricsResult.vue';
import AboutPage from './pages/about/Index.vue'
import AuthPage from './pages/Auth/Index.vue';
import OnboardingPage from './pages/Auth/OnboardingPage.vue';
import LyricsList from './pages/Lyrics/LyricsList.vue';
import RecommendList from './pages/Lyrics/RecommendList.vue';
// import NotFound from './pages/NotFound.vue';

import useSupabase  from './stores/supabase';
const { supabase } = useSupabase();
const router = createRouter({
    history: createWebHistory(),
    routes: [
        { path: '/', redirect: '/song/search' },
        { path: '/song/search', component: HomePage },
        { path: '/song/upload', component: LyricsEdit },
        { path: '/song', component: LyricsResult },
        { path: '/about', component: AboutPage },
        { path: '/login', component: AuthPage },
        { path: '/signup', component: AuthPage },
        { path: '/onboarding', component: OnboardingPage },
        { path: '/song/personal/list', component: LyricsList },
        { path: '/song/recommend/list', component: RecommendList },
        { path: '/:notFound(.*)', redirect: '/song/search' }
    ],
});

router.beforeEach(async (to, from) => {
    const { data: { session } } = await supabase.auth.getSession();
    if(to.fullPath === '/login' || to.fullPath === '/signup'){
        if(session?.user){
            return '/song/search'
        }
    }
    return true
})

export default router;