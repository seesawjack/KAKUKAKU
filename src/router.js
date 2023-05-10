import { createRouter, createWebHistory } from 'vue-router';

import HomePage from './pages/Home/Index.vue';
import LyricsEdit from './pages/Lyrics/LyricsEdit.vue';
import LyricsResult from './pages/Lyrics/LyricsResult.vue'
// import NotFound from './pages/NotFound.vue';

const router = createRouter({
    history:createWebHistory(),
    routes: [
        { path: '/', redirect:'/songlist' },
        { path: '/songlist', component:HomePage },
        { path: '/song/edit', component:LyricsEdit },
        { path: '/song', component:LyricsResult }
        // {path: '/:notFound(.*)',component:NotFound}

    ],
});

export default router;