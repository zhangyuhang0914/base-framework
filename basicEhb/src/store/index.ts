/*
 * @Desc         : Pinia 状态管理配置
 * @Autor        : ZhangYuHang
 * @Date         : 2024-12-19 17:45:00
 * @LastEditors  : Please set LastEditors
 * @LastEditTime : 2025-09-10 18:11:06
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
