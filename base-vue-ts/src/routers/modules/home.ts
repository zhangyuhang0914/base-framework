import type { AppRouteModule } from '@/routers/types'

const routers: AppRouteModule[] = [
  {
    path: '/',
    name: '',
    redirect: {
      name: 'Test'
    }
  }
]

export default routers
