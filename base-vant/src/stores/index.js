import { createPinia } from 'pinia'
import piniaPersist from 'pinia-plugin-persist'

const store = createPinia()
// 持久化存储
store.use(piniaPersist)

export function setupStore(app) {
  app.use(store)
}

export { store }
