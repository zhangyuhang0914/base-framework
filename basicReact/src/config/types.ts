/*
 * @Author       : 超人
 * @Description  : 配置类型定义
 * @Date         : 2025-07-29 17:04:19
 * @LastEditTime : 2025-08-01 10:14:35
 */

// 应用配置
export interface AppPreferences {
  accessMode: string
  authPageLayout: string
  checkUpdatesInterval: number
  colorGrayMode: boolean
  colorWeakMode: boolean
  compact: boolean
  contentCompact: string
  defaultAvatar: string
  dynamicTitle: boolean
  enableCheckUpdates: boolean
  enablePreferences: boolean
  enableRefreshToken: boolean
  isMobile: boolean
  layout: string
  locale: string
  loginExpiredMode: string
  name: string
  preferencesButtonPosition: string
  watermark: boolean
}

// 面包屑配置
export interface BreadcrumbPreferences {
  enable: boolean
  hideOnlyOne: boolean
  showHome: boolean
  showIcon: boolean
  styleType: string
}

// 版权配置
export interface CopyrightPreferences {
  companyName: string
  companySiteLink: string
  date: string
  enable: boolean
  icp: string
  icpLink: string
}

// 页脚配置
export interface FooterPreferences {
  enable: boolean
  fixed: boolean
}

// 页头配置
export interface HeaderPreferences {
  enable: boolean
  hidden: boolean
  mode: string
}

// Logo配置
export interface LogoPreferences {
  enable: boolean
  source: string
}

// 导航配置
export interface NavigationPreferences {
  accordion: boolean
  split: boolean
  styleType: string
}

// 快捷键配置
export interface ShortcutKeysPreferences {
  enable: boolean
  globalLockScreen: boolean
  globalLogout: boolean
  globalPreferences: boolean
  globalSearch: boolean
}

// 侧边栏配置
export interface SidebarPreferences {
  collapsed: boolean
  collapsedShowTitle: boolean
  enable: boolean
  expandOnHover: boolean
  extraCollapse: boolean
  hidden: boolean
  width: number
}

// 标签栏配置
export interface TabbarPreferences {
  dragable: boolean
  enable: boolean
  height: number
  keepAlive: boolean
  persist: boolean
  showIcon: boolean
  showMaximize: boolean
  showMore: boolean
  showRefresh: boolean
  styleType: string
}

// 主题配置
export interface ThemePreferences {
  builtinType: string
  colorDestructive: string
  colorPrimary: string
  colorSuccess: string
  colorWarning: string
  mode: 'light' | 'dark' | 'compact'
  radius: string
  semiDarkHeader: boolean
  semiDarkSidebar: boolean
}

// 过渡动画配置
export interface TransitionPreferences {
  enable: boolean
  loading: boolean
  name: string
  progress: boolean
}

// 小部件配置
export interface WidgetPreferences {
  fullscreen: boolean
  globalSearch: boolean
  languageToggle: boolean
  lockScreen: boolean
  notification: boolean
  sidebarToggle: boolean
  themeToggle: boolean
}

// 完整的偏好设置配置
export interface Preferences {
  app: AppPreferences
  breadcrumb: BreadcrumbPreferences
  copyright: CopyrightPreferences
  footer: FooterPreferences
  header: HeaderPreferences
  logo: LogoPreferences
  navigation: NavigationPreferences
  shortcutKeys: ShortcutKeysPreferences
  sidebar: SidebarPreferences
  tabbar: TabbarPreferences
  theme: ThemePreferences
  transition: TransitionPreferences
  widget: WidgetPreferences
  // 额外的全局配置
  language?: string
  algorithmTheme?: 'light' | 'dark' | 'compact'
}
