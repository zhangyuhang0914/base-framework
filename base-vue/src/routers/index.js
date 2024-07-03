import { createRouter, createWebHistory } from 'vue-router'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

// 加载进度条配置
NProgress.configure({
  showSpinner: false // 是否显示进度条右下方加载的小圆圈动画
})
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

// 路由钩子
router.beforeEach((to, from, next) => {
  // 进度条
  if (to.name !== from.name) {
    NProgress.start()
  }
  next()
})
router.afterEach((to, from) => {
  console.log('to, from', to, from)
  // 删除loading
  NProgress.done()
})

export default router
