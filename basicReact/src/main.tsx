import React from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import globalRouters from '@/router'
import { ConfigProvider } from 'antd'
import {
  legacyLogicalPropertiesTransformer,
  StyleProvider
} from '@ant-design/cssinjs'
import '@/assets/css/app.scss'
import { antdTheme } from '@/constants/theme.ts'
// React 19兼容 Ant Design
import '@ant-design/v5-patch-for-react-19'

const root = ReactDOM.createRoot(document.getElementById('root')!)
root.render(
  <React.StrictMode>
    {/* 全局化配置 */}
    <ConfigProvider
      theme={{
        token: antdTheme.token,
        components: antdTheme.components,
        algorithm: antdTheme.algorithm
      }}
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
  </React.StrictMode>
)
