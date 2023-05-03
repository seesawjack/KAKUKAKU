import { createRouter, createWebHistory } from 'vue-router';

import HomePage from './pages/Home/Index.vue'
// import NotFound from './pages/NotFound.vue';

const router = createRouter({
    history:createWebHistory(),
    routes: [
        {path: '/', component:HomePage},
        // {path: '/:notFound(.*)',component:NotFound}

    ],
});

export default router;