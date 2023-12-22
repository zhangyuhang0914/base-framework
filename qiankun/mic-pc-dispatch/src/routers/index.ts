import { createRouter, createWebHistory, Router } from 'vue-router'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import { projectName } from '@/conf/index'

// 全局进度条配置
NProgress.configure({
  easing: 'ease', // 动画方式
  speed: 1000, // 递增进度条的速度
  showSpinner: false, // 是否显示加载ico
  trickleSpeed: 200, //自动递增间隔
  minimum: 0.3 // 更改启动时使用的最小百分比
})

// 环境信息
// const { BASE_URL } = import.meta.env
// 获取所有路由
let routes: any = [
  // {
  //   path: '/:pathMatch(.*)*',
  //   redirect: '/404'
  // }
]

const modules = require.context('./modules', true, /\.ts$/)
modules.keys().forEach(key => {
  routes.push(...modules(key).default)
})

// 路由对象
const router: Router = createRouter({
  strict: true,
  history: createWebHistory('/' + projectName + '/'),
  routes
})
// 路由守卫
router.beforeEach((to, from, next) => {
  // 进度条
  NProgress.start()
  next()
})
router.afterEach((to, from) => {
  // 删除loading
  NProgress.done()
})

export default router
