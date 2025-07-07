import { UnitConverter } from '@/hooks/unitConverter'
import { theme, type ThemeConfig } from 'antd'

export const themeVariables = {
  // 颜色
  colors: {
    primary: UnitConverter.getCssVariable('--color-primary'),
    success: UnitConverter.getCssVariable('--color-success'),
    warning: UnitConverter.getCssVariable('--color-warning'),
    error: UnitConverter.getCssVariable('--color-error')
  },
  // 字体
  fontSize: {
    small: UnitConverter.getCssVariablePx('--font-size-small'),
    base: UnitConverter.getCssVariablePx('--font-size-base'),
    large: UnitConverter.getCssVariablePx('--font-size-large')
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
    fontSize: themeVariables.fontSize.base
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
