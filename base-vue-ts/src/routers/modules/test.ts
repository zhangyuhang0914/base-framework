import type { AppRouteModule } from '@/routers/types'

const routers: AppRouteModule[] = [
  {
    path: '/test',
    name: '',
    component: () => import('@/views/template/layout.vue'),
    redirect: {
      name: 'Test'
    },
    children: [
      {
        path: 'home',
        name: 'Test',
        component: () => import('@/views/test/test.vue'),
        meta: {
          title: 'Test',
          keepAlive: true
        }
      }
    ]
  }
]

export default routers
