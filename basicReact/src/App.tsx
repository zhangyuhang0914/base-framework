import React, { useEffect, useState } from 'react'
import { RouterProvider } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { setLanguage } from '@/redux/modules/global'
import type { RootState } from '@/redux'
import globalRouters from '@/router'
import { ConfigProvider } from 'antd'
import {
  legacyLogicalPropertiesTransformer,
  StyleProvider
} from '@ant-design/cssinjs'
import { antdTheme } from '@/constants/theme.ts'
import zhCN_WEB from 'antd/lib/locale/zh_CN'
import enUS_WEB from 'antd/lib/locale/en_US'
import { getBrowserLang } from '@/utils/system'
import { changeLanguage } from '@/language'
import type { Locale } from 'antd/es/locale'

const App: React.FC = () => {
  const dispatch = useDispatch()
  const { language } = useSelector((state: RootState) => state.global)
  const [i18nLocaleWeb, setI18nLocaleWeb] = useState(zhCN_WEB)

  // 设置 antd 语言国际化
  const setAntdLanguage = () => {
    // 如果 redux 中有默认语言就设置成 redux 的默认语言，没有默认语言就设置成浏览器默认语言
    if (language && language === 'zh') return setI18nLocaleWeb(zhCN_WEB)
    if (language && language === 'en') return setI18nLocaleWeb(enUS_WEB)
    if (getBrowserLang() === 'zh') return setI18nLocaleWeb(zhCN_WEB)
    if (getBrowserLang() === 'en') return setI18nLocaleWeb(enUS_WEB)
  }

  useEffect(() => {
    // 全局使用国际化
    changeLanguage(language || getBrowserLang())
    dispatch(setLanguage(language || getBrowserLang()))
    setAntdLanguage() // 监听 antd 语言国际化
  }, [language])

  return (
    <>
      {/* 全局化配置 */}
      <ConfigProvider
        theme={{
          token: antdTheme.token,
          components: antdTheme.components,
          algorithm: antdTheme.algorithm
        }}
        locale={i18nLocaleWeb as Locale}
      >
        {/*
          样式转换器
          hashPriority: :where 语法的兼容性在低版本浏览器比较差，如果需要支持旧版浏览器，你可以使用 @ant-design/cssinjs 取消默认的降权操作
          legacyLogicalPropertiesTransformer: 兼容旧版浏览器，请根据实际需求使用 StyleProvider 降级处理
        */}
        <StyleProvider
          hashPriority="high"
          transformers={[legacyLogicalPropertiesTransformer]}
        >
          <RouterProvider router={globalRouters}></RouterProvider>
        </StyleProvider>
      </ConfigProvider>
    </>
  )
}

export default App
