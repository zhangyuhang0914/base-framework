import type { AppRouteModule } from '@/router/interface'

/**
 * 主要路由模块
 * 包含应用的核心功能路由
 */
const mainRouter: AppRouteModule[] = [
  {
    path: '',
    name: 'Home',
    component: () => import('@/pages/home/index.vue'),
    meta: {
      title: '首页',
      keepAlive: true,
      ignoreAuth: true,
      key: 'Home'
    }
  }
]

export default mainRouter
