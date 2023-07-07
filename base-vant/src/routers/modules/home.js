const routers = [
  {
    path: '/404',
    name: '404',
    component: () => import('@/views/errorPage/404.vue'),
    meta: {
      title: '404',
      ignoreAuth: false
    }
  }
]

export default routers
