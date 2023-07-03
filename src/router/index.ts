import { createRouter, createWebHistory } from '@ionic/vue-router';
import { RouteRecordRaw } from 'vue-router';
import TabsPage from '../views/TabsPage.vue'
import SettingPage from '../views/SettingsPage.vue'

const routes: Array<RouteRecordRaw> = [
	{
		path: '',
		redirect: {
			name: 'home'
		}
	},
	{
		name: 'auth',
		path: '/auth',
		component: () => import('../views/Auth.vue')
	},
	{
		path: '/',
		component: TabsPage,
		children: [
			{
				name: 'home',
				path: 'home',
				component: () => import('../views/Home.vue')
			},
			{
				name: 'load',
				path: 'load',
				component: () => import('../views/OrderLoad.vue')
			},
			{
				name: 'menu',
				path: 'menu',
				component: () => import('../views/Menu.vue')
			},
		]
	},
	{
		path: '/settings',
		component: SettingPage,
		children: [
			{
				name: 'settings-workers',
				path: 'workers',
				component: () => import('../views/MenuWorkers.vue')
			},
			{
				name: 'settings-history',
				path: 'history',
				component: () => import('../views/MenuOrderHistory.vue')
			},
			{
				name: 'settings-prices',
				path: 'prices',
				component: () => import('../views/MenuPriceList.vue')
			},
			{
				name: 'settings-job',
				path: 'job', 
				component: () => import('../views/MenuJob.vue')
			},
			{
				name: 'settings-job-form',
				path: 'job/form', 
				component: () => import('../views/MenuJobForm.vue')
			}
		]
	},
]

const router = createRouter({
	history: createWebHistory(import.meta.env.BASE_URL),
	routes
})

export default router
