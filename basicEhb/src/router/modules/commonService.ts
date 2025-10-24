import type { AppRouteModule } from '@/router/interface'

/**
 * 主要路由模块
 * 包含应用的核心功能路由
 */
const commonServiceRouter: AppRouteModule[] = [
  {
    path: '/commonService',
    name: 'CommonServiceRouter',
    redirect: '/commonService/matterList',
    children: [
      {
        path: 'serviceOutlets',
        name: 'ServiceOutlets',
        component: () => import('@/pages/commonService/serviceOutlets/index.vue'),
        meta: {
          title: '办事网点',
          keepAlive: true
        }
      },
      {
        path: 'faultsList',
        name: 'FaultsList',
        component: () => import('@/pages/commonService/faultsList/index.vue'),
        meta: {
          title: '常见故障',
          keepAlive: true
        }
      },
      {
        path: 'faultsDetails',
        name: 'FaultsDetails',
        component: () => import('@/pages/commonService/faultsDetails/index.vue'),
        meta: {
          title: '故障详情',
          keepAlive: false
        }
      },
      {
        path: 'maintenanceApply',
        name: 'MaintenanceApply',
        component: () => import('@/pages/commonService/maintenanceApply/index.vue'),
        meta: {
          title: '我要报装',
          keepAlive: false
        }
      },
      {
        path: 'standardization',
        name: 'Standardization',
        component: () => import('@/pages/commonService/standardization/index.vue'),
        meta: {
          title: '标准化建设',
          keepAlive: true
        }
      },
      {
        path: 'governmentService',
        name: 'GovernmentService',
        component: () => import('@/pages/commonService/governmentService/index.vue'),
        meta: {
          title: '智慧广电乡村工程',
          keepAlive: true
        }
      }
    ]
  }
]

export default commonServiceRouter
