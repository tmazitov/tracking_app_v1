import { createRouter, createWebHistory } from '@ionic/vue-router';
import { RouteRecordRaw } from 'vue-router';
import TabsPage from '../views/TabsPage.vue'

const routes: Array<RouteRecordRaw> = [
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
        name: 'create-order',
        path: '/order/create',
        component: () => import('../views/CreateOrder.vue')
      },
      {
        path: 'tab3',
        component: () => import('../views/Tab3Page.vue')
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export default router
