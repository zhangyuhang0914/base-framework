import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'
// import styleImport from 'vite-plugin-style-import' // 按需引入
import VueSetupExtend from 'vite-plugin-vue-setup-extend'
import ElementPlus from 'unplugin-element-plus/vite'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
// https://vitejs.dev/config/
const BASE_URL = '/base/'

export default defineConfig({
  plugins: [
    vue(),
    VueSetupExtend(),
    ElementPlus(),
    AutoImport({
      resolvers: [ElementPlusResolver()]
    }),
    Components({
      resolvers: [ElementPlusResolver()]
    })
  ],
  css: {
    preprocessorOptions: {
      stylus: {
        imports: [resolve(__dirname, './src/assets/css/imports.styl')]
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
    port: 8899,
    host: '0.0.0.0',
    // hmr: {
    //   host: 'localhost',
    //   port: 8899
    // },
    https: false,
    open: false, // 启动服务是否自动打开浏览器
    cors: true, // 跨域
    // 代理
    proxy: {
      '/apis': {
        target: '',
        changeOrigin: true,
        rewrite: path => path.replace('/apis/', '/')
        // rewrite: path => path.resolve(/^\/api/, '') //
      }
    }
  }
})
