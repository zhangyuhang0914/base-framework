import { createRouter, createWebHistory } from 'vue-router'
import Nprogress from 'nprogress'
import 'nprogress/nprogress.css'
import { nextTick } from 'vue'

// 加载进度条配置
Nprogress.configure({
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
  const mod = modules[key].default || module
  const modList = Array.isArray(mod) ? [...mod] : [mod]
  routes.push(...modList)
})
// 路由对象
const router = createRouter({
  strict: true,
  history: createWebHistory(BASE_URL),
  routes
})

// 路由守卫
router.beforeEach((to, from, next) => {
  // 进度条
  if (to.name !== from.name) {
    Nprogress.start()
  }
  nextTick(() => {
    next()
  })
})
router.afterEach((to, from) => {
  // 删除loading
  Nprogress.done()
})

export default router
