import { createRouter, createWebHistory } from 'vue-router'
import { type App } from 'vue'
import { nprogressDone, nprogressStart } from '@/utils/nprogress'
import { getToken } from '@/utils/storage/cookie'

// 环境信息
const { BASE_URL } = import.meta.env
// 导入路由配置
import routesConfig from './routes'

// 获取所有路由
const routes: any = [
  ...routesConfig,
  {
    path: '/:pathMatch(.*)*',
    redirect: '/404'
  }
]

// 动态导入模块路由（如果存在）
const modules = import.meta.glob('./modules/**/*.ts', { eager: true })
Object.keys(modules).forEach(key => {
  const mod = (modules as Record<string, any>)[key].default || {}
  const modList = Array.isArray(mod) ? [...mod] : [mod]
  routes.push(...modList)
})
// 创建路由实例
const router = createRouter({
  history: createWebHistory(BASE_URL),
  routes,
  scrollBehavior(to, from, savedPosition) {
    // 路由切换时的滚动行为
    return savedPosition ?? { top: 0 }
  }
})

// 路由守卫
router.beforeEach((to, from, next) => {
  // 设置页面标题
  if (to.meta?.title) {
    document.title = `${to.meta.title} - 管理系统`
  }
  // 进度条
  if (to.name !== from.name) {
    nprogressStart()
  }
  // 权限校验
  if (!to.meta.ignoreAuth && !getToken()) {
    // 添加弹出登录逻辑
    next()
    return false
  }
  if (to.meta.ignoreAuth) {
    next()
  } else {
    getToken()
      ? next()
      : next({
          name: 'Login'
        })
  }
})
// 路由守卫
router.afterEach((to, from, next) => {
  nprogressDone()
})

export const useRouter = async (app: App<Element>) => {
  app.use(router)
  await router.isReady()
}

export default router
