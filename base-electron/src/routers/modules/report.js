const routers = [
  {
    path: '/report',
    name: 'report',
    redirect: {
      name: 'reportList'
    },
    component: () => import('@/views/template/layout/index.vue'),
    meta: {
      ignoreAuth: false
    },
    children: [
      {
        path: 'report/reportList',
        name: 'reportList',
        meta: {
          title: '报告列表'
        },
        component: () => import('@/views/report/index.vue')
      }
    ]
  }
]

export default routers
