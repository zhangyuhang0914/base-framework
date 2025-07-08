import type { AppRouteModule } from '@/router/interface'
import LazyLoad from '@/router/utils/lazyLoad'
import React from 'react'

const errorRouter: AppRouteModule[] = [
  {
    path: '/403',
    element: LazyLoad(React.lazy(() => import('@pages/errorPage/403'))),
    meta: {
      title: '403页面',
      ignoreAuth: true,
      key: '403'
    }
  },
  {
    path: '/404',
    element: LazyLoad(React.lazy(() => import('@pages/errorPage/404'))),
    meta: {
      title: '404页面',
      ignoreAuth: true,
      key: '404'
    }
  },
  {
    path: '/500',
    element: LazyLoad(React.lazy(() => import('@pages/errorPage/500'))),
    meta: {
      title: '500页面',
      ignoreAuth: true,
      key: '500'
    }
  }
]

export default errorRouter
