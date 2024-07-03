import type { AppRouteModule } from '@/routers/types'

const routers: AppRouteModule[] = [
  {
    path: '/',
    name: '',
    redirect: {
      name: 'Platform'
    }
  }
]

export default routers
