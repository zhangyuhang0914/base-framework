import React from 'react'
import ReactDOM from 'react-dom/client'
// 注意scss加载顺序，避免主题样式失效
import '@/assets/css/app.scss'
import { Provider } from 'react-redux'
// React 19兼容 Ant Design
import '@ant-design/v5-patch-for-react-19'
import { persistor, store } from '@/redux'
import { PersistGate } from 'redux-persist/integration/react'
import App from '@/App'

const root = ReactDOM.createRoot(document.getElementById('root')!)

root.render(
  <React.StrictMode>
    {/* redux 持久化 */}
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <App />
      </PersistGate>
    </Provider>
  </React.StrictMode>
)
