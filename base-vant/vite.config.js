import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'
// 静态资源压缩
import VitePluginCompression from 'vite-plugin-compression'
import VueSetupExtend from 'vite-plugin-vue-setup-extend'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { VantResolver } from 'unplugin-vue-components/resolvers'

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    // 设置别名
    alias: {
      '@': resolve(__dirname, 'src')
    }
  },
  plugins: [
    vue(),
    VueSetupExtend(),
    AutoImport({
      include: [
        /\.[tj]sx?$/, // .ts, .tsx, .js, .jsx
        /\.[m]js?$/, // .mjs
        /\.vue$/,
        /\.vue\?vue/ // .vue
      ],
      imports: ['vue'],
      resolvers: [VantResolver()]
    }),
    Components({
      resolvers: [VantResolver()]
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
    })
  ],
  server: {
    host: '0.0.0.0',
    port: 8082,
    // hmr: {
    //   host: 'localhost',
    //   port: '8082'
    // },
    open: false, // 启动服务是否自动打开浏览器
    cors: true, // 跨域
    // 设置 http 代理
    proxy: {
      '/nwmh-webspider': {
        target: 'http://192.168.1.246:8080/nwmh-webspider',
        changeOrigin: true,
        rewrite: path => path.replace(/^\/api/, '')
      }
    }
  }
})
