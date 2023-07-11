'use strict'

const routers = [
  {
    path: '/homePage',
    redirect: {
      name: 'HomePage'
    },
    component: () => import('@/views/template/layout.vue'),
    meta: {
      ignoreAuth: false
    },
    children: [
      {
        path: '/homePage',
        name: 'HomePage',
        meta: {
          title: '首页'
        },
        component: () => import('@/views/home-page/index.vue')
      }
    ]
  }
]

export default routers
