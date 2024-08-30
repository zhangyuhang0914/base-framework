import type { AppRouteModule } from '@/routers/types'

const routers: AppRouteModule[] = [
  {
    path: '/',
    name: '',
    redirect: {
      name: 'About'
    }
  }
]

export default routers
