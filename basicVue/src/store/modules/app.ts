/*
 * @Author       : 超人
 * @Description  : 应用设置状态管理
 * @Date         : 2025-08-07 14:00:06
 * @LastEditTime : 2025-08-07 15:08:32
 */
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { ThemeMode, LanguageType, DeviceType } from '../interface'

// 使用组合式 API 风格定义应用设置 store
export const useAppStore = defineStore(
  'app',
  () => {
    // 状态
    const theme = ref<ThemeMode>('light')
    const language = ref<LanguageType>('zh')
    const sidebarCollapsed = ref<boolean>(false)
    const loading = ref<boolean>(false)
    const deviceType = ref<DeviceType>('desktop')

    // 计算属性
    const isDarkMode = computed(() => {
      if (theme.value === 'auto') {
        return window.matchMedia('(prefers-color-scheme: dark)').matches
      }
      return theme.value === 'dark'
    })

    const isMobile = computed(() => deviceType.value === 'mobile')
    const isTablet = computed(() => deviceType.value === 'tablet')
    const isDesktop = computed(() => deviceType.value === 'desktop')

    // 方法
    const setTheme = (newTheme: ThemeMode) => {
      theme.value = newTheme
      // 应用主题到 document
      document.documentElement.setAttribute('data-theme', newTheme)
    }

    const setLanguage = (newLanguage: LanguageType) => {
      language.value = newLanguage
      // 设置 HTML lang 属性
      document.documentElement.lang = newLanguage
    }

    const toggleSidebar = () => {
      sidebarCollapsed.value = !sidebarCollapsed.value
    }

    const setSidebarCollapsed = (collapsed: boolean) => {
      sidebarCollapsed.value = collapsed
    }

    const setLoading = (isLoading: boolean) => {
      loading.value = isLoading
    }

    const setDeviceType = (type: DeviceType) => {
      deviceType.value = type
      // 移动端自动收起侧边栏
      if (type === 'mobile') {
        sidebarCollapsed.value = true
      }
    }

    // 初始化设备类型检测
    const initDeviceType = () => {
      const width = window.innerWidth
      if (width < 768) {
        setDeviceType('mobile')
      } else if (width < 1024) {
        setDeviceType('tablet')
      } else {
        setDeviceType('desktop')
      }
    }

    // 监听窗口大小变化
    const handleResize = () => {
      initDeviceType()
    }

    // 初始化应用设置
    const initApp = () => {
      initDeviceType()
      window.addEventListener('resize', handleResize)

      // 应用保存的主题
      setTheme(theme.value)
      setLanguage(language.value)
    }

    return {
      // 状态
      theme,
      language,
      sidebarCollapsed,
      loading,
      deviceType,
      // 计算属性
      isDarkMode,
      isMobile,
      isTablet,
      isDesktop,
      // 方法
      setTheme,
      setLanguage,
      toggleSidebar,
      setSidebarCollapsed,
      setLoading,
      setDeviceType,
      initApp
    }
  },
  {
    // 持久化配置
    persist: {
      key: 'app-store',
      pick: ['theme', 'language', 'sidebarCollapsed'],
      storage: typeof window !== 'undefined' ? localStorage : undefined
    }
  }
)
