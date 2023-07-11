'use strict'

const routers = [
  {
    path: '/login',
    redirect: {
      name: 'Login'
    },
    component: () => import('@/views/template/layout/index.vue'),
    meta: {
      ignoreAuth: false
    },
    children: [
      {
        path: '/login',
        name: 'Login',
        meta: {
          title: '登录'
        },
        component: () => import('@/views/login/index.vue')
      }
    ]
  }
]

export default routers
