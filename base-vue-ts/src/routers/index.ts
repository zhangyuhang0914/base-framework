import { createRouter, createWebHashHistory, type Router } from 'vue-router'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import { nextTick } from 'vue'
import { getToken } from '@/utils/cookie'

// 全局进度条配置
NProgress.configure({
  easing: 'ease', // 动画方式
  speed: 1000, // 递增进度条的速度
  showSpinner: false, // 是否显示加载ico
  trickleSpeed: 200, //自动递增间隔
  minimum: 0.3 // 更改启动时使用的最小百分比
})

// 环境信息
const { BASE_URL } = import.meta.env
// 获取所有路由
const routes: any = [
  {
    path: '/:pathMatch(.*)*',
    redirect: '/404'
  }
]
const modules = import.meta.glob('./modules/**/*.ts', { eager: true })
Object.keys(modules).forEach(key => {
  const mod = (modules as Record<string, any>)[key].default || {}
  const modList = Array.isArray(mod) ? [...mod] : [mod]
  routes.push(...modList)
})

// 路由对象
const router: Router = createRouter({
  strict: true,
  history: createWebHashHistory(BASE_URL),
  routes
})
// 路由守卫
router.beforeEach((to, from, next) => {
  // 进度条
  if (to.name !== from.name) {
    NProgress.start()
  }
  console.log('ignoreAuth', to.meta.ignoreAuth, getToken())
  if (!to.meta.ignoreAuth && !getToken()) {
    // 添加弹出登录逻辑
    next()
    return false
  }
  if (to.meta.ignoreAuth) {
    nextTick(() => {
      next()
    })
  } else {
    nextTick(() => {
      getToken()
        ? next()
        : next({
            name: 'Login'
          })
    })
  }
})
router.afterEach((to, from, next) => {
  // 删除loading
  NProgress.done()
})

export default router
