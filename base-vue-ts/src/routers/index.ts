import { createRouter, createWebHistory, Router } from 'vue-router'
import { userCommonStoreHook } from '@/stores/modules/common'
// 环境信息
const { BASE_URL } = import.meta.env
// 获取所有路由
let routes: any = [{
  path: '/:pathMatch(.*)*',
  redirect: '/404'
}]
const modules = import.meta.globEager('./modules/**/*.ts')
Object.keys(modules).forEach((key) => {
  const mod = modules[key].default || {};
  const modList = Array.isArray(mod) ? [...mod] : [mod];
  routes.push(...modList);
});
// 路由对象
const router: Router = createRouter({
  strict: true,
  history: createWebHistory(BASE_URL),
  routes
});
// 路由守卫
router.beforeEach((to, from, next) => {

})
router.afterEach((to, from) => {
  userCommonStoreHook().setRouter(to)
})

export default router
