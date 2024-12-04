import type { AppRouteModule } from '@/routers/types'

const routers: AppRouteModule[] = [
  {
    path: '/',
    name: 'dashaed',
    redirect: {
      name: 'Home'
    }
  }
]

export default routers
