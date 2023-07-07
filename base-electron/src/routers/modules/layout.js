const routers = [
  {
    path: '/layout',
    name: 'layout',
    component: () => import('@/views/template/layout/index.vue'),
    meta: {
      title: 'layout',
      ignoreAuth: true
    }
  }
]

export default routers
