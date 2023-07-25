'use strict'

const routers = [
  {
    path: '/login',
    redirect: {
      name: 'Login'
    },
    meta: {
      ignoreAuth: false
    },
    component: () => import('@/views/template/layout.vue'),
    children: [
      {
        path: '/login',
        name: 'Login',
        meta: {
          title: '登录'
        },
        component: () => import('@/views/login/index.vue')
      }, {
        path: '/card-login',
        name: 'CardLogin',
        meta: {
          title: '自然人身份证登录'
        },
        component: () => import('@/views/login/components/card-login/index.vue')
      }, {
        path: '/ehb-login',
        name: 'EhbLogin',
        meta: {
          title: '鄂汇办扫码登录'
        },
        component: () => import('@/views/login/components/ehb-login/index.vue')
      }
    ]
  }
]

export default routers
