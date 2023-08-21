import type {
  RouteRecordRaw,
  RouteMeta,
  RouteRecordRedirectOption
} from 'vue-router'
import { defineComponent } from 'vue'

export type Component<T = any> =
  | ReturnType<typeof defineComponent>
  | (() => Promise<typeof import('*.vue')>)
  | (() => Promise<T>)

export interface AppRouteRecordRaw extends Omit<RouteRecordRaw, 'meta'> {
  name: string
  meta?: RouteMeta
  component?: Component | string
  components?: Component
  children?: RouteRecordRaw[]
  fullPath?: string
  redirect?: RouteRecordRedirectOption | undefined
}

export type AppRouteModule = AppRouteRecordRaw
