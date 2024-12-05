import type { AppRouteModule } from '@/routers/types'

const routers: AppRouteModule[] = [
  {
    path: '/demandBusiness',
    name: 'DemandBusiness',
    redirect: 'DemandApply',
    children: [
      {
        path: 'enterpriseApply',
        name: 'EnterpriseApply',
        component: () => import('@/views/demandBusiness/enterpriseApply/index.vue'),
        meta: {
          title: '企业需求申报',
          ignoreAuth: false,
          keepAlive: true
        }
      },
      {
        path: 'teamApply',
        name: 'TeamApply',
        component: () => import('@/views/demandBusiness/teamApply/index.vue'),
        meta: {
          title: '走访组需求申报',
          ignoreAuth: false,
          keepAlive: true
        }
      }
    ]
  }
]

export default routers
