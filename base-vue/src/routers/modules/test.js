const routers = [
  {
    path: '/test',
    name: 'test',
    redirect: {
      name: 'ListScroll'
    },
    component: () => import('@/views/test/layout/index.vue'),
    meta: {
      title: 'test',
      ignoreAuth: true
    },
    children: [
      {
        path: 'listScroll',
        name: 'ListScroll',
        component: () => import('@/views/test/list-scroll/index.vue'),
        meta: {
          title: 'ListScroll',
          ignoreAuth: true,
          keepAlive: true
        }
      }
    ]
  }
]

export default routers
