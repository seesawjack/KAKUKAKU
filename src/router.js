import { createRouter, createWebHistory } from 'vue-router';

import HomePage from './pages/Home/Index.vue';
import LyricsEdit from './pages/Lyrics/LyricsEdit.vue';
import LyricsResult from './pages/Lyrics/LyricsResult.vue'
// import NotFound from './pages/NotFound.vue';

const router = createRouter({
    history:createWebHistory(),
    routes: [
        { path: '/', redirect:'/SongList' },
        { path: '/SongList', component:HomePage },
        { path: '/SongList/edit/:id', component:LyricsEdit },
        { path: '/SongList/:id', component:LyricsResult }
        // {path: '/:notFound(.*)',component:NotFound}

    ],
});

export default router;