import type { AppRouteModule } from '@/routers/types'

const routers: AppRouteModule[] = [
  {
    path: '/about',
    name: '',
    component: () => import('@/views/template/layout.vue'),
    redirect: {
      name: 'About'
    },
    children: [
      {
        path: 'home',
        name: 'About',
        component: () => import('@/views/about/index.vue'),
        meta: {
          title: 'About',
          keepAlive: true
        }
      }
    ]
  }
]

export default routers
