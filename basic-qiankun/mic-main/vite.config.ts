import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'
import VueSetupExtend from 'vite-plugin-vue-setup-extend'
import ElementPlus from 'unplugin-element-plus/vite'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import ViteImages from 'vite-plugin-vue-images'
// https://vitejs.dev/config/

// 设置文根
// const BASE_URL = '/mic-pc-main/'
const BASE_URL = '/'

export default defineConfig({
  plugins: [
    vue(),
    VueSetupExtend(),
    ElementPlus(),
    AutoImport({
      imports: ['vue', 'vue-router', 'pinia'],
      resolvers: [ElementPlusResolver()]
    }),
    Components({
      resolvers: [ElementPlusResolver()]
    }),
    ViteImages({
      dirs: ['src/assets/images'] // 指明图片存放目录
    })
  ],
  css: {
    preprocessorOptions: {
      stylus: {
        imports: [resolve(__dirname, './src/assets/css/components/theme.styl')]
      }
    }
  },
  resolve: {
    // 设置快捷指向
    alias: {
      '@': resolve(__dirname, 'src')
    }
  },
  base: BASE_URL,
  server: {
    port: 8086,
    host: '0.0.0.0',
    https: false,
    open: false, // 启动服务是否自动打开浏览器
    cors: true, // 跨域
    // 代理
    proxy: {
      '/jgswappms': {
        // target: 'http://59.225.205.32:8888', // 四川机关事务局-生产环境-内网
        target: 'http://202.61.90.152:28888', // 四川机关事务局-生产环境-互联网
        changeOrigin: true,
        secure: false
      }
    }
  }
})
