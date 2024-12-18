import type { AppRouteModule } from '@/routers/types'

const routers: AppRouteModule[] = [
  {
    path: '/entry',
    name: 'Entry',
    component: () => import('@/views/entry/index.vue'),
    meta: {
      title: 'Entry',
      ignoreAuth: false,
      keepAlive: true
    }
  }
]

export default routers
