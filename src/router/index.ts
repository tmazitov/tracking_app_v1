import { createRouter, createWebHistory } from '@ionic/vue-router';
import { RouteRecordRaw } from 'vue-router';
import TabsPage from '../views/TabsPage.vue'

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
        name: 'profile',
        path: 'profile',
        component: () => import('../views/Profile.vue')
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export default router
