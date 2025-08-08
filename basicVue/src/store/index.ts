/*
 * @Desc         : Pinia 状态管理配置
 * @Autor        : ZhangYuHang
 * @Date         : 2024-12-19 17:45:00
 * @LastEditors  : Please set LastEditors
 * @LastEditTime : 2025-08-07 17:33:50
 */

import type { App } from 'vue'
import { createPinia } from 'pinia'
import { createPersistedState } from 'pinia-plugin-persistedstate'

// 创建 pinia 实例
const pinia = createPinia()

// 配置持久化插件
pinia.use(
  createPersistedState({
    // 默认存储到 localStorage
    storage: localStorage,
    // 可以配置序列化方式
    serializer: {
      serialize: JSON.stringify,
      deserialize: JSON.parse
    },
    // 默认所有 store 都持久化，可以在具体 store 中覆盖
    auto: true
  })
)

// Pinia 安装函数
export default function setupStore(app: App) {
  app.use(pinia)
}

// 导出 pinia 实例供其他地方使用
export { pinia }
