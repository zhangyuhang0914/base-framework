import type { AppRouteModule } from '@/routers/types'

const routers: AppRouteModule[] = [
  {
    path: '/test',
    name: 'Test',
    component: () => import('@/views/template/layout.vue'),
    redirect: {
      name: 'Index'
    },
    children: [
      {
        path: 'index',
        name: 'Index',
        component: () => import('@/views/test/index.vue'),
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
