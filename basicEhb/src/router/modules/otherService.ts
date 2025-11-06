import type { AppRouteModule } from '@/router/interface'

/**
 * 其他服务路由模块
 * 包含文章列表和文章详情页面
 */
const otherServiceRouter: AppRouteModule[] = [
  {
    path: '/otherService',
    name: 'OtherServiceRouter',
    redirect: '/otherService/articlelist',
    children: [
      {
        path: 'articlelist',
        name: 'ArticleList',
        component: () => import('@/pages/otherService/articlelist.vue'),
        meta: {
          title: '政策文件列表',
          keepAlive: true
        }
      },
      {
        path: 'articledetail',
        name: 'ArticleDetail',
        component: () => import('@/pages/otherService/articledetail.vue'),
        meta: {
          title: '政策文件详情',
          keepAlive: false
        }
      }
    ]
  }
]

export default otherServiceRouter