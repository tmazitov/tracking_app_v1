import { createRouter, createWebHistory } from '@ionic/vue-router';
import { RouteRecordRaw } from 'vue-router';
import TabsPage from '../views/TabsPage.vue'
import { useIonRouter } from '@ionic/vue';

import { AccessTokenPairAPI } from '../api/auth/auth'

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
        path: 'home',
        component: () => import('../views/Home.vue')
      },
      {
        path: 'tab2',
        component: () => import('../views/Tab2Page.vue')
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
