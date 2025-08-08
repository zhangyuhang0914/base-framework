// 路由类型定义

import type { RouteRecordRaw, RouteMeta } from 'vue-router'
import { defineComponent } from 'vue'

export type Component<T = any> =
  | ReturnType<typeof defineComponent>
  | (() => Promise<typeof import('*.vue')>)
  | (() => Promise<T>)

export interface MateProps extends RouteMeta {
  keepAlive?: boolean
  ignoreAuth?: boolean
  title: string
  key?: string
}

// @ts-ignore
export interface AppRouteRecordRaw extends Omit<RouteRecordRaw, 'meta'> {
  name?: string
  path?: string
  meta?: MateProps
  component?: Component | string
  components?: Component
  children?: AppRouteRecordRaw[]
  fullPath?: string
}

export type AppRouteModule = AppRouteRecordRaw
