const routers = [
  {
    path: '/',
    name: '',
    redirect: {
      name: 'task'
    },
    component: () => import('@/views/template/layout/index.vue'),
    meta: {
      ignoreAuth: false // 是否不需要验证权限
    }
  }
]

export default routers
