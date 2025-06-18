import { createBrowserRouter } from 'react-router'
import App from '@/App'
import Home from '@/pages/home/index'
import Dispatch from '@/pages/dispatch/index'

// 注册全局路由
export const globalRouters = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { path: '', element: <Home /> },
      { path: 'dispatch', element: <Dispatch /> }
    ]
  }
])
