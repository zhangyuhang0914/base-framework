import type React from 'react'
import type { NonIndexRouteObject } from 'react-router-dom'

// 路由菜单配置
export interface MateProps {
  keepAlive?: boolean
  ignoreAuth?: boolean
  title: string
  key?: string
}

// 路由配置
export interface AppRouteRecordRaw
  extends Omit<NonIndexRouteObject, 'children' | 'meta'> {
  path?: string
  element?: React.ReactNode
  errorElement?: React.ReactNode
  caseSensitive?: boolean
  children?: AppRouteRecordRaw[]
  meta?: MateProps
  isLink?: string
}

export type AppRouteModule = AppRouteRecordRaw
