import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'
// import styleImport from 'vite-plugin-style-import' // 按需引入
import VueSetupExtend from 'vite-plugin-vue-setup-extend'
import ElementPlus from 'unplugin-element-plus/vite'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
// 静态资源压缩
import VitePluginCompression from 'vite-plugin-compression'
// 浏览器兼容
import legacyPlugin from '@vitejs/plugin-legacy'
// eslint
import eslintPlugin from 'vite-plugin-eslint'

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    // 设置快捷指向
    alias: {
      '@': resolve(__dirname, 'src')
    }
  },
  plugins: [
    vue(),
    VueSetupExtend(),
    ElementPlus(),
    AutoImport({
      include: [
        /\.[tj]sx?$/, // .ts, .tsx, .js, .jsx
        /\.vue$/,
        /\.vue\?vue/ // .vue
      ],
      imports: ['vue'],
      resolvers: [ElementPlusResolver()]
    }),
    Components({
      resolvers: [ElementPlusResolver()]
    }),
    VitePluginCompression({
      verbose: true,
      // 不禁用压缩
      disable: false,
      // 压缩后是否删除原文件
      deleteOriginFile: false,
      // 压缩前最小文件大小
      threshold: 10240,
      // 文件类型
      algorithm: 'gzip',
      // 压缩算法
      ext: '.gz'
    }),
    // 增加下面的配置项,这样在运行时就能检查eslint规范
    eslintPlugin({
      include: ['src/**/*.js', 'src/**/*.vue', 'src/*.js', 'src/*.vue']
    }),
    legacyPlugin({
      targets: ['chrome 52'], // 需要兼容的目标列表，可以设置多个
      additionalLegacyPolyfills: ['regenerator-runtime/runtime'] // 面向IE11时需要此插件
    })
  ],
  server: {
    port: '8086',
    // host: '0.0.0.0',
    hmr: {
      host: 'localhost',
      port: '8086'
    },
    open: false, // 启动服务是否自动打开浏览器
    cors: true, // 跨域
    // 设置 http 代理
    proxy: {
      '/apis': {
        target: 'http://192.168.1.246:1117/jgfw-webspider',
        changeOrigin: true,
        secure: false,
        rewrite: path => path.replace('/jgfw-webspider', ''),
        ws: true
      }
    }
  }
})
