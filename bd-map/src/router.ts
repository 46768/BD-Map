import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/root/index.vue'

const router = createRouter({
	history: createWebHistory(import.meta.env.BASE_URL),
	routes: [
		{
			path: '/',
			name: 'root',
			component: HomeView
		},
		{
			path: '/about',
			name: 'about',
			component: () => import('@/views/about/index.vue')
		},
		{
			path: '/dev/editor',
			name: 'dev/editor',
			component: () => import('@/views/dev/editor/index.vue')
		},
	]
})

export default router
