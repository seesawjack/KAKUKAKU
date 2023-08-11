import { createRouter, createWebHistory } from 'vue-router';

import HomePage from './pages/Home/Index.vue';
import LyricsEdit from './pages/Lyrics/LyricsEdit.vue';
import LyricsResult from './pages/Lyrics/LyricsResult.vue';
import AboutPage from './pages/about/Index.vue'
import AuthPage from './pages/Auth/Index.vue';
import OnboardingPage from './pages/Auth/OnboardingPage.vue';
import LyricsList from './pages/Lyrics/LyricsList.vue';
import RecommendList from './pages/Lyrics/RecommendList.vue';
import FeedBackPage from './pages/FeedBack/Index.vue';
import ForgetPassword from './pages/Auth/ForgetPassword.vue';
import UpdatePassword from './pages/Auth/UpdatePassword.vue';
// import NotFound from './pages/NotFound.vue';

import useSupabase from './stores/supabase';
const { supabase } = useSupabase();
const router = createRouter({
    history: createWebHistory(),
    routes: [
        { path: '/', redirect: '/song/search' },
        {
            path: '/song',
            children: [
                { path: 'item', component: LyricsResult },
                { path: 'search', component: HomePage },
                { path: 'upload', component: LyricsEdit },
                { path: 'personal/list', component: LyricsList },
                { path: 'recommend/list', component: RecommendList },
            ]
        },
        { path: '/about', component: AboutPage },
        { path: '/login', component: AuthPage },
        { path: '/signup', component: AuthPage },
        { path: '/onboarding', component: OnboardingPage },
        { path: '/feedback', component: FeedBackPage },
        {
            path: '/account',
            children: [
                {
                    path: 'forget-password',
                    component: ForgetPassword
                },
                {
                    path: 'update-password',
                    component: UpdatePassword
                },
            ]
        },
        { path: '/:notFound(.*)', redirect: '/song/search' }
    ],
});

router.beforeEach(async (to, from) => {
    const { data: { session } } = await supabase.auth.getSession();
    if (to.fullPath === '/login' || to.fullPath === '/signup') {
        if (session?.user) {
            return '/song/search'
        }
    }
    return true
})

export default router;