import { defineConfig } from 'vite'
import { resolve } from 'path'
import uni from '@dcloudio/vite-plugin-uni'
import VueSetupExtend from 'vite-plugin-vue-setup-extend'
import AutoImport from 'unplugin-auto-import/vite'
// 静态资源压缩
import VitePluginCompression from 'vite-plugin-compression'

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    // App 小程序端源码调试
    sourcemap: true
    // 发布时删除 console
    // minify: 'terser',
    // terserOptions: {
    //   compress: {
    //     drop_console: true
    //   }
    // }
  },
  resolve: {
    // 设置快捷指向
    alias: {
      '@': resolve(__dirname, 'src')
    }
  },
  plugins: [
    uni(),
    VueSetupExtend(),
    AutoImport({
      include: [
        /\.[tj]sx?$/, // .ts, .tsx, .js, .jsx
        /\.vue$/,
        /\.vue\?vue/ // .vue
      ],
      imports: ['vue', 'uni-app']
    }),
    VitePluginCompression({
      // 是否在控制台输出压缩结果
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
  // @ts-ignore
  transpileDependencies: ['uview-plus'],
  server: {
    // port: '8086',
    // host: '0.0.0.0',
    hmr: {
      host: 'localhost',
      port: 8086
    },
    https: false,
    open: false, // 启动服务是否自动打开浏览器
    cors: true, // 跨域
    // 设置 http 代理
    proxy: {
      '/szxqyxyxx': {
        target: 'https://jrb.hubei.gov.cn',
        changeOrigin: true
      }
    }
  }
})
