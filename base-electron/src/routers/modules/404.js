'use strict'

const routers = [
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
