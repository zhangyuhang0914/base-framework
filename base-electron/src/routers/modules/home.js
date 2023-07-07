const routers = [
  {
    path: '/',
    name: ''
  },
  {
    path: '/404',
    name: '404',
    component: () => import('@/views/errorPage/404.vue'),
    meta: {
      title: '404',
      ignoreAuth: true
    }
  }
]

export default routers
