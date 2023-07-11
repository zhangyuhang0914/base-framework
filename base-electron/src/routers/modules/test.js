'use strict'

const routers = [
  {
    path: '/test',
    redirect: {
      name: 'Test'
    },
    component: () => import('@/views/template/layout.vue'),
    meta: {
      ignoreAuth: false
    },
    children: [
      {
        path: '/test',
        name: 'Test',
        meta: {
          title: '测试'
        },
        component: () => import('@/views/test/index.vue')
      }
    ]
  }
]

export default routers
