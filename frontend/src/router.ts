import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '@/pages/indexRoot.vue';

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            name: 'root',
            component: HomeView,
        },
        {
            path: '/about',
            name: 'about',
            component: () => import('@/pages/about/indexAbout.vue'),
        },
        {
            path: '/dev/editor',
            name: 'dev/editor',
            component: () => import('@/pages/dev/editor/indexEditor.vue'),
        },
    ],
});

export default router;
