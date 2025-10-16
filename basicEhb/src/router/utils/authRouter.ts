import { nprogressStart } from '@/utils/nprogress'
import { getToken } from '@/utils/storage/cookie'
import type { NavigationGuardNext, RouteLocationNormalized } from 'vue-router'

/**
 * 路由守卫工具函数
 * 在 Vue 中，路由守卫通常直接在 router/index.ts 中定义
 * 这个工具函数提供了权限验证的核心逻辑
 */
export const authGuard = (to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext): boolean => {
  // 进度条
  if (to.name !== from.name) {
    nprogressStart()
  }
  // 权限校验
  if (!to.meta.ignoreAuth && !getToken()) {
    // 需要登录但未登录，重定向到登录页
    // 注意：当前项目中没有Login路由，这里暂时重定向到首页
    next({
      name: 'Home',
      replace: true
    })
    return false
  }
  return true
}

/**
 * 页面标题设置
 */
export const setPageTitle = (to: RouteLocationNormalized): void => {
  const appTitle = import.meta.env.VITE_GLOBAL_APP_TITLE
  if (to.meta?.title) {
    document.title = `${appTitle} - ${to.meta.title}`
  } else {
    document.title = appTitle
  }
}
