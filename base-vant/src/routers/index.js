import { createRouter, createWebHistory } from 'vue-router'
import Nprogress from 'nprogress'
import 'nprogress/nprogress.css'
import { userCommonStoreHook } from '@/stores/modules/common'

// 加载进度条配置
Nprogress.configure({
  showSpinner: false // 是否显示进度条右下方加载的小圆圈动画
})
const token = userCommonStoreHook().token
// 环境信息
const { BASE_URL } = import.meta.env

const routes = [
  {
    path: '/:pathMatch(.*)*',
    redirect: '/404'
  }
]
const modules = import.meta.globEager('./modules/**/*.js')
Object.keys(modules).forEach(key => {
  console.log('key', key)
  const mod = modules[key].default || {}
  const modList = Array.isArray(mod) ? [...mod] : [mod]
  routes.push(...modList)
})
const router = createRouter({
  strict: true,
  history: createWebHistory(BASE_URL),
  routes: [{
    path: '/',
    name: 'root',
    component: () => import('../App.vue'),
    // 默认重定向功能菜单
    redirect: () => {
      return {
        path: '/systemMenu'
      }
    },
    children: routes
  }]
})

// 路由钩子
router.beforeEach((to, from, next) => {
  console.log('路由钩子1', to, from)
  // 进度条
  Nprogress.start()
  if (!token) {
    next({
      replace: true,
      name: '404'
    })
    return false
  } else {
    next()
  }
})
router.afterEach((to, from, next) => {
  console.log('路由钩子2', to, from)
  // 删除loading
  Nprogress.done()
})

export default router
