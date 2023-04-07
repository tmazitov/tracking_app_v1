import { createRouter, createWebHistory } from '@ionic/vue-router';
import { RouteRecordRaw } from 'vue-router';
import TabsPage from '../views/TabsPage.vue'

import { AccessTokenPairAPI } from '../api/auth/auth'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    redirect: '/tabs/tab1'
  },
  {
    name: 'auth',
    path: '/auth',
    component: () => import('../views/Auth.vue')
  },
  {
    path: '/tabs/',
    component: TabsPage,
    children: [
      {
        path: '',
        redirect: '/tabs/tab1'
      },
      {
        path: 'tab1',
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

router.beforeEach((from, to) => {
  // if (AccessTokenPairAPI.getAccess() == null && from.name != 'auth'){
  //   router.push({
  //     name: 'auth'
  //   })
  // }
})

export default router
