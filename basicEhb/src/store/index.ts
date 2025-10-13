/*
 * Pinia 状态管理配置
 */

import type { App } from 'vue'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

// 创建 pinia 实例
const piniaStore = createPinia()
// 配置持久化插件
piniaStore.use(piniaPluginPersistedstate)

// Pinia 安装函数
export default function setupStore(app: App) {
  app.use(piniaStore)
}

// 导出 pinia 实例供其他地方使用
export { piniaStore }
