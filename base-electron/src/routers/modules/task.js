const routers = [
  {
    path: '/task',
    name: 'task',
    redirect: {
      name: 'taskList'
    },
    component: () => import('@/views/template/layout/index.vue'),
    meta: {
      ignoreAuth: false
    },
    children: [
      {
        path: '/task/taskList',
        name: 'taskList',
        meta: {
          title: '任务列表'
        },
        component: () => import('@/views/task/index.vue')
      }
    ]
  }
]

export default routers
