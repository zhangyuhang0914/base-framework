import { UnitConverter } from '@/utils/common/unitConverter'
import { preferencesManager } from '@/config/preferencesManager'

/**
 * 获取当前主题的 CSS 变量值
 * 用于在组件中动态获取主题相关的样式值
 */
export const getThemeVariables = () => {
  return {
    // 颜色
    colors: {
      default: UnitConverter.getCssVariable('--color-default'),
      primary: UnitConverter.getCssVariable('--color-primary'),
      success: UnitConverter.getCssVariable('--color-success'),
      warning: UnitConverter.getCssVariable('--color-warning'),
      error: UnitConverter.getCssVariable('--color-error')
    },
    // 字体
    fontSize: {
      xs: UnitConverter.getCssVariablePx('--font-size-xs'),
      small: UnitConverter.getCssVariablePx('--font-size-small'),
      base: UnitConverter.getCssVariablePx('--font-size-base'),
      large: UnitConverter.getCssVariablePx('--font-size-large')
    },
    // 边框
    border: {
      width: UnitConverter.getCssVariablePx('--border-width'),
      colorDefault: UnitConverter.getCssVariable('--border-color-default')
    },
    // 圆角
    borderRadius: {
      none: UnitConverter.getCssVariablePx('--border-radius-none'),
      xs: UnitConverter.getCssVariablePx('--border-radius-xs'),
      sm: UnitConverter.getCssVariablePx('--border-radius-sm'),
      md: UnitConverter.getCssVariablePx('--border-radius-md'),
      lg: UnitConverter.getCssVariablePx('--border-radius-lg'),
      default: UnitConverter.getCssVariablePx('--border-radius-default')
    }
  }
}

/**
 * 导出主题变量的静态实例
 * 注意：这是一个静态快照，如果需要实时的主题值，请使用 getThemeVariables() 函数
 */
export const themeVariables = getThemeVariables()

/**
 * 获取 Antd 主题配置
 * 基于 preferencesManager 的配置动态生成 Ant Design 主题
 */
export const getAntdThemeConfig = () => {
  const theme = preferencesManager.getTheme()
  const radiusValue = parseFloat(theme.radius || '0.5') * 12
  return {
    token: {
      colorPrimary: theme.colorPrimary,
      borderRadius: radiusValue,
      borderRadiusXS: radiusValue * 0.5,
      borderRadiusSM: radiusValue * 0.75,
      borderRadiusLG: radiusValue * 1.25,
      colorSuccess: theme.colorSuccess,
      colorWarning: theme.colorWarning,
      colorError: theme.colorDestructive
    },
    components: {
      Button: {
        borderRadius: radiusValue
      },
      Card: {
        borderRadiusLG: radiusValue
      },
      Input: {
        borderRadius: radiusValue
      },
      Select: {
        borderRadius: radiusValue
      },
      Modal: {
        borderRadiusLG: radiusValue
      },
      Drawer: {
        borderRadiusLG: radiusValue
      },
      Segmented: {
        borderRadius: radiusValue,
        trackPadding: 4
      },
      Switch: {
        borderRadius: radiusValue
      },
      Slider: {
        borderRadiusXS: radiusValue * 0.5
      },
      Progress: {
        borderRadius: radiusValue
      },
      Tag: {
        borderRadiusSM: radiusValue * 0.75
      },
      Badge: {
        borderRadiusSM: radiusValue * 0.75
      },
      Tooltip: {
        borderRadius: radiusValue * 0.75
      },
      Popover: {
        borderRadiusOuter: radiusValue
      },
      Notification: {
        borderRadiusLG: radiusValue
      },
      Message: {
        borderRadiusLG: radiusValue
      }
    }
  }
}