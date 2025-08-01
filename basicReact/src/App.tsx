import React, { useEffect, useState } from 'react'
import { RouterProvider } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { setLanguage } from '@/redux/modules/global'
import type { RootState } from '@/redux'
import globalRouters from '@/router'
import { App as AntDesginApp, ConfigProvider, theme } from 'antd'
import { legacyLogicalPropertiesTransformer, StyleProvider } from '@ant-design/cssinjs'
import zhCN_WEB from 'antd/lib/locale/zh_CN'
import enUS_WEB from 'antd/lib/locale/en_US'
import { getBrowserLang } from '@/utils/system'
import { changeLanguage } from '@/language'
import type { Locale } from 'antd/es/locale'
import { ThemeUtils } from '@/utils/common/themeUtils'
import { preferencesManager } from '@/config/preferencesManager'
import { getAntdThemeConfig } from '@/constants/theme'
import { NotificationProvider } from '@/components/antd'

const App: React.FC = () => {
  const dispatch = useDispatch()
  const { language, algorithmTheme } = useSelector((state: RootState) => state.global)
  const [i18nLocaleWeb, setI18nLocaleWeb] = useState(zhCN_WEB)
  const [antdThemeConfig, setAntdThemeConfig] = useState(getAntdThemeConfig())
  const [themeVersion, setThemeVersion] = useState(0)

  // 设置 antd 语言国际化
  const setAntdLanguage = () => {
    // 如果 redux 中有默认语言就设置成 redux 的默认语言，没有默认语言就设置成浏览器默认语言
    if (language && language === 'zh') return setI18nLocaleWeb(zhCN_WEB)
    if (language && language === 'en') return setI18nLocaleWeb(enUS_WEB)
    if (getBrowserLang() === 'zh') return setI18nLocaleWeb(zhCN_WEB)
    if (getBrowserLang() === 'en') return setI18nLocaleWeb(enUS_WEB)
  }
  // 根据algorithmTheme获取对应的算法
  const getAlgorithmTheme = () => {
    /**
     * defaultAlgorithm: 默认算法
     * darkAlgorithm: 暗色算法
     * compactAlgorithm: 紧凑算法
     */
    switch (algorithmTheme) {
      case 'dark':
        return theme.darkAlgorithm
      case 'compact':
        return theme.compactAlgorithm
      default:
        return theme.defaultAlgorithm
    }
  }

  useEffect(() => {
    // 全局使用国际化
    changeLanguage(language || getBrowserLang())
    dispatch(setLanguage(language || getBrowserLang()))
    setAntdLanguage() // 监听 antd 语言国际化
  }, [language])
  // 监听配置变化并应用主题色和圆角配置
  useEffect(() => {
    const currentTheme = preferencesManager.getTheme()
    // 应用主题色
    if (currentTheme.colorPrimary) {
      ThemeUtils.updateThemeColor(currentTheme.colorPrimary)
    }
    // 应用圆角配置
    if (currentTheme.radius) {
      const baseValue = parseFloat(currentTheme.radius) * 12 // 将value转换为像素值
      const root = document.documentElement
      root.style.setProperty('--border-radius-none', '0px')
      root.style.setProperty('--border-radius-xs', `${baseValue * 0.25}px`)
      root.style.setProperty('--border-radius-sm', `${baseValue * 0.5}px`)
      root.style.setProperty('--border-radius-md', `${baseValue * 0.75}px`)
      root.style.setProperty('--border-radius-lg', `${baseValue * 1.25}px`)
      root.style.setProperty('--border-radius-default', `${baseValue}px`)
    }
    // 监听配置变化
    const unsubscribe = preferencesManager.addListener(() => {
      const newTheme = preferencesManager.getTheme()
      // 实时更新主题色
      if (newTheme.colorPrimary) {
        ThemeUtils.updateThemeColor(newTheme.colorPrimary)
      }
      // 实时更新圆角配置
      if (newTheme.radius) {
        const baseValue = parseFloat(newTheme.radius) * 12
        const root = document.documentElement
        root.style.setProperty('--border-radius-none', '0px')
        root.style.setProperty('--border-radius-xs', `${baseValue * 0.25}px`)
        root.style.setProperty('--border-radius-sm', `${baseValue * 0.5}px`)
        root.style.setProperty('--border-radius-md', `${baseValue * 0.75}px`)
        root.style.setProperty('--border-radius-lg', `${baseValue * 1.25}px`)
        root.style.setProperty('--border-radius-default', `${baseValue}px`)
      }
      // 更新 Antd 主题配置
      setAntdThemeConfig(getAntdThemeConfig())
      setThemeVersion(prev => prev + 1)
    })
    return unsubscribe
  }, [])

  return (
    <>
      {/* 全局化配置 */}
      <AntDesginApp>
        <ConfigProvider
          theme={
            {
              algorithm: getAlgorithmTheme(),
              ...antdThemeConfig,
              _version: themeVersion // 用于主题更新
            } as any
          }
          locale={i18nLocaleWeb as Locale}
        >
          <NotificationProvider>
            {/*
            样式转换器
            hashPriority: :where 语法的兼容性在低版本浏览器比较差，如果需要支持旧版浏览器，你可以使用 @ant-design/cssinjs 取消默认的降权操作
            legacyLogicalPropertiesTransformer: 兼容旧版浏览器，请根据实际需求使用 StyleProvider 降级处理
            layer: 进行统一降权。经过降权后，antd 的样式将始终低于默认的 CSS 选择器优先级，以便于用户进行样式覆盖
          */}
            <StyleProvider hashPriority="high" transformers={[legacyLogicalPropertiesTransformer]}>
              <RouterProvider router={globalRouters}></RouterProvider>
            </StyleProvider>
          </NotificationProvider>
        </ConfigProvider>
      </AntDesginApp>
    </>
  )
}

export default App
