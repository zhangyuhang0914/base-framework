'use strict'

const routers = [
  {
    path: '/setting',
    name: 'Setting',
    component: () => import('@/views/setting/index.vue'),
    meta: {
      ignoreAuth: false
    }
  }
]

export default routers
