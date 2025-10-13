import { type App } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import { nprogressDone } from '@/utils/nprogress'
import { authGuard, setPageTitle } from '@/router/utils/authRouter'
import routesConfig from './routes'

// 环境信息
const { BASE_URL } = import.meta.env

// 获取所有路由
const routes: any = [...routesConfig]

console.log('routes', routes);
// 创建路由实例
const router = createRouter({
  history: createWebHistory(BASE_URL),
  routes,
  scrollBehavior(to, from, savedPosition) {
    // 路由切换时的滚动行为
    return savedPosition ?? { top: 0 }
  }
})

/**
 * 全局前置守卫
 */
router.beforeEach((to, from, next) => {
  // 调用权限验证工具函数
  const authResult = authGuard(to, from, next)
  if (!authResult) {
    return
  }
  next()
})
/**
 * 全局后置守卫
 */
router.afterEach((to) => {
  // 设置页面标题
  setPageTitle(to)
  // 结束进度条
  nprogressDone()
})

export const useRouter = async (app: App<Element>) => {
  app.use(router)
  await router.isReady()
}

export default router
