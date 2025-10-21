import type { AppRouteModule } from '@/router/interface'

/**
 * 主要路由模块
 * 包含应用的核心功能路由
 */
const governmentServiceRouter: AppRouteModule[] = [
  {
    path: '/governmentService',
    name: 'GovernmentService',
    redirect: '/governmentService/matterList',
    children: [
      {
        path: 'matterList',
        name: 'MatterList',
        component: () => import('@/pages/governmentService/matterList/index.vue'),
        meta: {
          title: ' 便民查询',
          keepAlive: true
        }
      },
      {
        path: 'serviceList',
        name: 'ServiceList',
        component: () => import('@/pages/governmentService/serviceList/index.vue'),
        meta: {
          title: ' 办事服务',
          keepAlive: true
        }
      },
      {
        path: 'questionList',
        name: 'QuestionList',
        component: () => import('@/pages/governmentService/questionList/index.vue'),
        meta: {
          title: ' 常见问题',
          keepAlive: false
        }
      }
    ]
  }
]

export default governmentServiceRouter
