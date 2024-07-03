const routers = [
  {
    path: '/systemMenu',
    name: 'systemMenu',
    component: () => import('@/views/systemMenu/index.vue'),
    meta: {
      title: '功能菜单',
      ignoreAuth: false
    }
  }
]

export default routers
