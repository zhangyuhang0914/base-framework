import React from 'react'
import ReactDOM from 'react-dom/client'
import router from './router'
import { Provider } from 'react-redux'
import { App, ConfigProvider } from 'antd'
import { RouterProvider } from 'react-router-dom'
import store from '@/store/index'
// 引入全局样式
import './index.scss'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    {/* 状态管理 */}
    <Provider store={store}>
      {/* 全局配置 */}
      <ConfigProvider
        theme={{
          components: {
            Button: {
              borderColorDisabled: '#000'
            }
          }
        }}
      >
        {/* 全局上下文组件 */}
        <App
          message={{
            duration: 1.5
          }}
        >
          {/* 路由 */}
          <RouterProvider router={router} />
        </App>
      </ConfigProvider>
    </Provider>
  </React.StrictMode>
)
