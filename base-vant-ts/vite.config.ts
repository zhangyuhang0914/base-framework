import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'
import VueSetupExtend from 'vite-plugin-vue-setup-extend'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { VantResolver } from 'unplugin-vue-components/resolvers'
import viteLegacyPlugin from '@vitejs/plugin-legacy'

// 设置文根
const BASE_URL = process.env.NODE_ENV === 'production' ? './' : '/'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    VueSetupExtend(),
    AutoImport({
      resolvers: [VantResolver()]
    }),
    Components({
      resolvers: [VantResolver()]
    }),
    viteLegacyPlugin({
      targets: ['chrome 52', 'ie >= 11'], // 需要兼容的目标列表，可以设置多个
      additionalLegacyPolyfills: ['regenerator-runtime/runtime'] // 面向IE11时需要此插件
    })
  ],
  resolve: {
    // 设置快捷指向
    alias: {
      '@': resolve(__dirname, './src')
    }
  },
  build: {
    // 指定输出路径
    outDir: 'dist-ionic'
  },
  base: BASE_URL,
  server: {
    port: 8086,
    host: '0.0.0.0',
    open: true, // 启动服务是否自动打开浏览器
    cors: true, // 跨域
    proxy: {
      '/iframework': {
        target: 'http://192.168.1.246:19604/',
        changeOrigin: true,
        secure: false
      }
    }
  }
})
