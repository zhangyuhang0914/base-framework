'use strict'

const routers = [
  {
    path: '/itemSelection',
    redirect: {
      name: 'ItemSelection'
    },
    component: () => import('@/views/template/layout.vue'),
    meta: {
      ignoreAuth: false
    },
    children: [
      {
        path: '/itemSelection',
        name: 'ItemSelection',
        meta: {
          title: '事项选择'
        },
        component: () => import('../../views/itemSelection/ItemSelection.vue')
      }, {
        path: '/itemGuide',
        name: 'ItemGuide',
        meta: {
          title: '事项指南'
        },
        component: () => import('../../views/itemSelection/ItemGuide.vue')
      }, {
        path: '/itemHandle',
        name: 'ItemHandle',
        meta: {
          title: '自助办'
        },
        component: () => import('../../views/itemSelection/ItemHandle.vue')
      }
    ]
  }
]

export default routers
