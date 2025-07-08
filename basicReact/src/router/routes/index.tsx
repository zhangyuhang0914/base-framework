import App from '@/App'
import ErrorPage from '@/pages/errorPage/404'
import type { AppRouteModule } from '@/router/interface'
import errorRouter from '@/router/modules/error'
import mainRouter from '@/router/modules/main'

const rootRouter: AppRouteModule[] = [
  {
    path: '/',
    element: <App />,
    errorElement: <ErrorPage />,
    children: [...mainRouter]
  },
  ...errorRouter,
  {
    path: '/:pathMatch(.*)*',
    element: <ErrorPage />
  }
]

export default rootRouter
