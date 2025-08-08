import type { AppRouteRecordRaw } from '../interface'

// 示例路由配置
const routes: AppRouteRecordRaw[] = [
  {
    path: '/',
    name: 'Home',
    component: () => import('@/components/HelloWorld.vue'),
    meta: {
      title: '首页',
      keepAlive: false,
      ignoreAuth: true
    }
  },
  {
    path: '/hello',
    name: 'Hello',
    component: () => import('@/components/HelloWorld.vue'),
    meta: {
      title: 'Hello World',
      keepAlive: true,
      ignoreAuth: false
    }
  },
  {
    path: '/404',
    name: '404',
    component: () => import('@/components/HelloWorld.vue'),
    meta: {
      title: '页面未找到',
      keepAlive: false,
      ignoreAuth: true
    }
  }
]

export default routes