import { createRouter, createWebHashHistory, type Router } from 'vue-router'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import { nextTick } from 'vue'
import { getToken } from '@/utils/cookie'
import { $toast } from '@/plugins/vant'

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
  routes,
  /**
   * 切换路由时，滚动条位置还原
   * @param to 路由对象
   * @param form 上一个路由对象
   * @param savedPosition 保存滚动位置
   * @returns
   * https://router.vuejs.org/zh/guide/advanced/scroll-behavior.html
   */
  scrollBehavior(to, form, savedPosition) {
    return savedPosition ?? { top: 0 }
  }
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
    $toast('登录失效，请重新登录！')
    next({
      name: 'Login'
    })
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
