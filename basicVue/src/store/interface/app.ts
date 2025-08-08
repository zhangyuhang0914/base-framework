/*
 * @Desc         : 应用设置状态管理相关类型定义
 * @Autor        : ZhangYuHang
 * @Date         : 2024-12-19 17:50:00
 * @LastEditors  : ZhangYuHang
 * @LastEditTime : 2024-12-19 17:50:00
 */

// 主题模式类型
export type ThemeMode = 'light' | 'dark' | 'auto'

// 语言类型
export type LanguageType = 'zh' | 'en'

// 设备类型
export type DeviceType = 'desktop' | 'tablet' | 'mobile'

// 布局模式
export type LayoutMode = 'vertical' | 'horizontal' | 'mix'

// 菜单模式
export type MenuMode = 'inline' | 'horizontal' | 'vertical'

// 应用配置接口
export interface AppConfig {
  // 主题设置
  theme: ThemeMode
  // 语言设置
  language: LanguageType
  // 侧边栏是否收起
  sidebarCollapsed: boolean
  // 全局加载状态
  loading: boolean
  // 设备类型
  deviceType: DeviceType
  // 布局模式
  layoutMode: LayoutMode
  // 菜单模式
  menuMode: MenuMode
  // 是否显示标签页
  showTabs: boolean
  // 是否显示面包屑
  showBreadcrumb: boolean
  // 是否显示页脚
  showFooter: boolean
  // 是否开启页面缓存
  keepAlive: boolean
  // 动画类型
  transitionName: string
}

// 窗口尺寸信息
export interface WindowSize {
  width: number
  height: number
}

// 断点配置
export interface BreakpointConfig {
  xs: number // 超小屏幕
  sm: number // 小屏幕
  md: number // 中等屏幕
  lg: number // 大屏幕
  xl: number // 超大屏幕
  xxl: number // 超超大屏幕
}

// 主题配置
export interface ThemeConfig {
  // 主色调
  primaryColor: string
  // 成功色
  successColor: string
  // 警告色
  warningColor: string
  // 错误色
  errorColor: string
  // 信息色
  infoColor: string
  // 边框圆角
  borderRadius: number
  // 阴影
  boxShadow: string
}

// 应用状态枚举
export enum AppStatus {
  LOADING = 'loading',
  READY = 'ready',
  ERROR = 'error'
}

// 动画类型枚举
export enum TransitionType {
  FADE = 'fade',
  SLIDE_LEFT = 'slide-left',
  SLIDE_RIGHT = 'slide-right',
  SLIDE_UP = 'slide-up',
  SLIDE_DOWN = 'slide-down',
  ZOOM = 'zoom'
}

// 布局配置
export interface LayoutConfig {
  // 头部高度
  headerHeight: number
  // 侧边栏宽度
  sidebarWidth: number
  // 侧边栏收起宽度
  sidebarCollapsedWidth: number
  // 标签页高度
  tabsHeight: number
  // 页脚高度
  footerHeight: number
}