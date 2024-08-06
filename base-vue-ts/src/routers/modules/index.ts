import type { AppRouteModule } from '@/routers/types'

const routers: AppRouteModule[] = [
  {
    path: '/home',
    name: 'Home',
    component: () => import('@/views/template/layout.vue'),
    children: [
      {
        path: '/',
        name: 'index',
        component: () => import('@/views/home/index.vue'),
        meta: {
          title: 'Home',
          ignoreAuth: true,
          keepAlive: true
        }
      }
    ]
  }
]

export default routers
