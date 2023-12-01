import { createApp } from 'vue'
import App from './App.vue'
import utilsFn from '@/plugins/utils'

const app = createApp(App)
utilsFn(app)
app.mount('#app')
