import type { AppRouteModule } from '../types'

const routers: AppRouteModule[] = [
  {
    path: '/',
    name: '',
    redirect: {
      name: 'HelloWorld'
    }
  },
  {
    path: '/helloWorld',
    name: 'HelloWorld',
    component: () => import('@/components/HelloWorld.vue'),
    meta: {
      title: 'HelloWorld',
      ignoreAuth: true
    }
  },
  {
    path: '/404',
    name: '404',
    component: () => import('@/views/error-page/404.vue'),
    meta: {
      title: '404',
      ignoreAuth: true
    }
  }
]

export default routers
