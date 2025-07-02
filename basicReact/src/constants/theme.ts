import { getCssVariable } from '@/utils/common'
import { theme, type ThemeConfig } from 'antd'

export const themeVariables = {
  // 颜色
  colors: {
    primary: getCssVariable('--color-primary'),
    success: getCssVariable('--color-success'),
    warning: getCssVariable('--color-warning'),
    error: getCssVariable('--color-error')
  },
  // 字体
  fontSize: {
    small: getCssVariable('--font-size-small'),
    base: getCssVariable('--font-size-base'),
    large: getCssVariable('--font-size-large')
  }
}

// Ant Design 主题配置
export const antdTheme: ThemeConfig = {
  // 全局样式
  token: {
    colorPrimary: themeVariables.colors.primary,
    colorSuccess: themeVariables.colors.success,
    colorWarning: themeVariables.colors.warning,
    colorError: themeVariables.colors.error,
    fontSize: Number(themeVariables.fontSize.base.replace('px', ''))
  },
  // 组件样式
  components: {},
  /**
   * defaultAlgorithm: 默认算法
   * darkAlgorithm: 暗色算法
   * compactAlgorithm: 紧凑算法
   */
  algorithm: theme.defaultAlgorithm
}
