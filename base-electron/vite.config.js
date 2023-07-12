import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'
import electron from 'vite-plugin-electron'
import electronRender from 'vite-plugin-electron-renderer'
import VueSetupExtend from 'vite-plugin-vue-setup-extend'
import ElementPlus from 'unplugin-element-plus/vite'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import eslintPlugin from 'vite-plugin-eslint'

const BASE_URL = process.env.NODE_ENV === 'production' ? './' : '/' // 设置文根

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    VueSetupExtend(),
    ElementPlus(),
    AutoImport({
      include: [
        /\.[tj]sx?$/, // .ts, .tsx, .js, .jsx
        /\.[m]js?$/, // .mjs
        /\.vue$/,
        /\.vue\?vue/ // .vue
      ],
      imports: ['vue', 'vue-router'],
      eslintrc: {
        enabled: true, // 已存在文件设置默认 false，需要更新时再打开，防止每次更新都重新生成
        filepath: './.eslintrc-auto-import.json', // 生成公共引入组件文件地址和名称
        globalsPropValue: true
      },
      resolvers: [ElementPlusResolver()]
    }),
    Components({
      resolvers: [ElementPlusResolver()]
    }),
    // 增加下面的配置项,这样在运行时就能检查eslint规范
    eslintPlugin({
      include: ['src/**/*.js', 'src/**/*.vue', 'src/*.js', 'src/*.vue']
    }),
    // 主进程配置
    electron({
      entry: 'electron/main.js'
    }),
    electronRender()
  ],
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
    cors: true, // 跨域// 代理
    proxy: {
      '/jgfw-webspider': {
        target: 'http://192.168.1.246:1117/',
        changeOrigin: true,
        secure: false
        // ws: false
      }
    }
  }
})
