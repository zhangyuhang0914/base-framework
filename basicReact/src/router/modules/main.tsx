import type { AppRouteModule } from '@/router/interface'
import LazyLoad from '@/router/utils/lazyLoad'
import React from 'react'

const mainRouter: AppRouteModule[] = [
  {
    path: '',
    element: LazyLoad(React.lazy(() => import('@pages/home/index'))),
    meta: {
      title: '首页',
      ignoreAuth: true,
      key: 'Home'
    }
  },
  {
    path: '/dispatch',
    element: LazyLoad(React.lazy(() => import('@pages/dispatch/index'))),
    meta: {
      title: '调度',
      ignoreAuth: true,
      key: 'Dispatch'
    }
  }
]

export default mainRouter
