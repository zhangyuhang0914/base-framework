import type { AppRouteModule } from '@/routers/types'

const routers: AppRouteModule[] = [
  {
    path: '/auth',
    name: 'Auth',
    redirect: 'Login',
    children: [
      {
        path: 'login',
        name: 'Login',
        component: () => import('@/views/auth/login/index.vue'),
        meta: {
          title: '登录',
          ignoreAuth: true,
          keepAlive: true
        }
      },
      {
        path: 'register',
        name: 'Register',
        component: () => import('@/views/auth/register/index.vue'),
        meta: {
          title: '注册',
          ignoreAuth: true,
          keepAlive: true
        }
      }
    ]
  }
]

export default routers
