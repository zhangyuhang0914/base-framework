import { createRouter, createWebHistory, Router } from 'vue-router'

// 环境信息
const { BASE_URL } = import.meta.env
// 获取所有路由
let routes: any = [
  {
    path: '/:pathMatch(.*)*',
    redirect: '/404'
  }
]

const modules = import.meta.globEager('./modules/**/*.ts')
Object.keys(modules).forEach(key => {
  const mod = (modules[key] as any).default || {}
  const modList = Array.isArray(mod) ? [...mod] : [mod]
  routes.push(...modList)
})

// console.log('routes', modules)

let routerFn = () =>
  createRouter({
    strict: true,
    history: createWebHistory(BASE_URL),
    routes
  })
let router: Router = routerFn()

export default router
