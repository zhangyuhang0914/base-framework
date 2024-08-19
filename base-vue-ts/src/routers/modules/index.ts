import type { AppRouteModule } from '@/routers/types'

const routers: AppRouteModule[] = [
  {
    path: '/home',
    name: 'Home',
    component: () => import('@/views/template/layout.vue'),
    redirect: {
      name: 'Index'
    },
    children: [
      {
        path: '',
        name: 'Index',
        component: () => import('@/views/home/index.vue'),
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
