import type { AppRouteModule } from '@/routers/types'

const routers: AppRouteModule[] = [
  {
    path: '/platform',
    name: 'Platform',
    component: () => import('@/views/template/layout.vue'),
    redirect: {
      name: 'Index'
    },
    children: [
      {
        path: 'index',
        name: 'Index',
        component: () => import('@/views/platform/index/index.vue'),
        meta: {
          title: 'Index',
          ignoreAuth: true,
          keepAlive: true
        }
      }
    ]
  }
]

export default routers
