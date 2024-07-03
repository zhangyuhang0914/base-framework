const routers = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/login/index.vue'),
    meta: {
      title: 'Login',
      ignoreAuth: true
    }
  }
]

export default routers
