'use strict'

const routers = [
  {
    path: '/setting',
    name: 'Setting',
    meta: {
      title: '首页'
    },
    component: () => import('@/views/setting/index.vue')
  }
]

export default routers

