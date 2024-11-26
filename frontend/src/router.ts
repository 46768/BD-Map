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
            path: '/docs',
            name: 'docs',
            component: () => import('@/pages/docs/indexDocs.vue'),
        },

        {
            path: '/docs/mapjs',
            name: 'docs/mapjs',
            component: () => import('@/pages/docs/mapJS.vue'),
        },

        {
            path: '/docs/room',
            name: 'docs/room',
            component: () => import('@/pages/docs/rooms.vue'),
        },
        {
            path: '/docs/polygon',
            name: 'docs/polygon',
            component: () => import('@/pages/docs/polygon.vue'),
        },
    ],
});

export default router;
