import { createBrowserRouter } from 'react-router'
import App from '@/App'
import React from 'react'
import NotFoundPage from '@/pages/notFoundPage'

// 懒加载组件
const HomePage = React.lazy(() => import('@/pages/home/index'))
const DispatchPage = React.lazy(() => import('@/pages/dispatch/index'))

// 注册全局路由
export const globalRouters = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    errorElement: <NotFoundPage />,
    children: [
      {
        path: '',
        element: <HomePage />
      },
      {
        path: 'dispatch',
        element: <DispatchPage />
      }
    ]
  },
  {
    path: '*',
    element: <NotFoundPage />
  }
])
