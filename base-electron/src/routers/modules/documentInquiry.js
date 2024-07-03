'use strict'

const routers = [
  {
    path: '/documentInquiry',
    redirect: {
      name: 'DocumentInquiry'
    },
    component: () => import('@/views/template/layout.vue'),
    meta: {
      ignoreAuth: false
    },
    children: [
      {
        path: '/documentInquiry',
        name: 'DocumentInquiry',
        meta: {
          title: '办件查询'
        },
        component: () => import('../../views/documentInquiry/DocumentInquiry.vue')
      }
    ]
  }
]

export default routers
