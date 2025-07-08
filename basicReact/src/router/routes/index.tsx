import ErrorPage from '@/pages/errorPage/404'
import Layout from '@/pages/layout'
import type { AppRouteModule } from '@/router/interface'
import errorRouter from '@/router/modules/error'
import mainRouter from '@/router/modules/main'

const rootRouter: AppRouteModule[] = [
  {
    path: '/',
    element: <Layout />,
    errorElement: <ErrorPage />,
    children: [...mainRouter]
  },
  ...errorRouter,
  {
    path: '*',
    element: <ErrorPage />
  }
]

export default rootRouter
