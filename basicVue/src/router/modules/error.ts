import type { AppRouteModule } from '@/router/interface'
import LazyLoad from '@/router/utils/lazyLoad'

/**
 * 错误路由模块
 * 包含403、404、500等错误页面路由
 */
const errorRouter: AppRouteModule[] = [
  {
    path: '/403',
    name: '403',
    component: LazyLoad(() => import('@/pages/errorPage/403.vue')),
    meta: {
      title: '403页面',
      ignoreAuth: true,
      key: '403'
    }
  },
  {
    path: '/404',
    name: '404',
    component: LazyLoad(() => import('@/pages/errorPage/404.vue')),
    meta: {
      title: '404页面',
      keepAlive: false,
      ignoreAuth: true,
      key: '404'
    }
  },
  {
    path: '/500',
    name: '500',
    component: LazyLoad(() => import('@/pages/errorPage/500.vue')),
    meta: {
      title: '500页面',
      ignoreAuth: true,
      key: '500'
    }
  },
  {
    // 通配符路由，匹配所有未定义的路由
    path: '/:pathMatch(.*)*',
    name: 'NotFoundRedirect',
    redirect: '/404',
    meta: {
      title: '404页面',
      ignoreAuth: true,
      key: 'NotFoundRedirect'
    }
  }
]

export default errorRouter
