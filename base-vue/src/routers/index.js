import { createRouter, createWebHistory } from 'vue-router'

// 环境信息
const { BASE_URL } = import.meta.env

// 获取所有路由
const routes = [
  {
    path: '/:pathMatch(.*)*',
    redirect: '/404'
  }
]
const modules = import.meta.globEager('./modules/**/*.js')
Object.keys(modules).forEach(key => {
  const mod = modules[key].default || {}
  const modList = Array.isArray(mod) ? [...mod] : [mod]
  routes.push(...modList)
})

const router = createRouter({
  strict: true,
  history: createWebHistory(BASE_URL),
  routes
})

export default router
