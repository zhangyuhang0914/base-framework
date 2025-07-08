import rootRouter from '@/router/routes'
import { searchRoute } from '@/utils/common/route'
import type { JSX } from 'react'
import { useLocation } from 'react-router-dom'

/**
 * 路由守卫
 */
const AuthRouter = (props: { children: JSX.Element }) => {
  const { pathname } = useLocation()
  const route = searchRoute(pathname, rootRouter)
  // 设置页面标题
  const title = import.meta.env.VITE_GLOBAL_APP_TITLE
  document.title = route.meta?.title ? `${route.meta.title} - ${title}` : title

  // TODO 在跳转路由之前，清除所有的请求

  // 判断当前路由是否需要访问权限(不需要权限直接放行)
  if (!route.meta?.ignoreAuth) return props.children
  // TODO 判断是否登录
  return props.children
}

export default AuthRouter
