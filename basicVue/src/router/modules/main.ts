import type { AppRouteModule } from '@/router/interface'
import LazyLoad from '@/router/utils/lazyLoad'

/**
 * 主要路由模块
 * 包含应用的核心功能路由
 */
const mainRouter: AppRouteModule[] = [
  {
    path: '',
    name: 'Home',
    component: LazyLoad(() => import('@/pages/home/index.vue')),
    meta: {
      title: '首页',
      keepAlive: true,
      ignoreAuth: true,
      key: 'Home'
    }
  },
  {
    path: '/dispatch',
    name: 'Dispatch',
    component: LazyLoad(() => import('@/pages/dispatch/index.vue')),
    meta: {
      title: '调度页面',
      keepAlive: true,
      ignoreAuth: true,
      key: 'Dispatch'
    }
  }
]

export default mainRouter
