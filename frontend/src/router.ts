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
        {
            path: '/dev/editor/parser',
            name: 'dev/editor/p',
            component: () => import('@/pages/dev/editor/indexParser.vue'),
        },
        {
            path: '/dev/editor/parserv2',
            name: 'dev/editor/p2',
            component: () => import('@/pages/dev/editor/indexParserv2.vue'),
        },
    ],
});

export default router;
