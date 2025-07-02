import { createBrowserRouter } from 'react-router'
import App from '@/App'
import React from 'react'
import NotFoundPage from '@/pages/notFoundPage'

// 懒加载组件
const Home = React.lazy(() => import('@/pages/home/index'))
const Dispatch = React.lazy(() => import('@/pages/dispatch/index'))

// 注册全局路由
export const globalRouters = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    errorElement: <NotFoundPage />,
    children: [
      { path: '', element: <Home /> },
      { path: 'dispatch', element: <Dispatch /> }
    ]
  },
  {
    path: '*',
    element: <NotFoundPage />
  }
])
