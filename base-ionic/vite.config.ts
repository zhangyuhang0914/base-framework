import { defineConfig } from 'vite'
import legacy from '@vitejs/plugin-legacy'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'
import VueSetupExtend from 'vite-plugin-vue-setup-extend'

// 设置文根
const BASE_URL = process.env.NODE_ENV === 'production' ? './' : '/'
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), VueSetupExtend(), legacy()],
  css: {
    preprocessorOptions: {
      stylus: {
        imports: [resolve(__dirname, './src/assets/ionic-css/imports.styl')]
      }
    }
  },
  resolve: {
    // 设置快捷指向
    alias: {
      '@': resolve(__dirname, './src')
    }
  },
  base: BASE_URL,
  server: {
    port: 8806,
    host: '0.0.0.0',
    open: false, // 启动服务是否自动打开浏览器
    cors: true, // 跨域
    proxy: {
      '/iframework': {
        target: 'http://192.168.1.246:19604/',
        changeOrigin: true,
        secure: false
      }
    }
  },
  test: {
    globals: true,
    environment: 'jsdom'
  }
})
