import { createApp } from 'vue'
import App from './App.vue'
import utilsFn from '@/plugins/utils'
import elementPlusFn from '@/plugins/element'

const app = createApp(App)
utilsFn(app)
elementPlusFn(app)
app.mount('#app')
