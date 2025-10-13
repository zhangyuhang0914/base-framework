import { getMainModules } from '@/router/modules'
import type { AppRouteRecordRaw } from '@/router/interface'

const routes: AppRouteRecordRaw[] = [
  {
    path: '/',
    name: 'Layout',
    component: () => import('@/pages/layout/index.vue'),
    redirect: {
      name: 'Home'
    },
    meta: {
      title: '首页',
      keepAlive: true,
      ignoreAuth: true
    },
    children: [
      // 动态获取所有非错误路由作为子路由
      ...getMainModules()
    ]
  }
]

export default routes
