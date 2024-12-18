import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path, { resolve } from 'path'
import VitePluginCompression from 'vite-plugin-compression'
// https://vitejs.dev/config/

// 设置文根
// const BASE_URL = process.env.NODE_ENV === 'production' ? '/jgd/' : '/'
const BASE_URL = '/'

export default defineConfig({
  plugins: [
    react(),
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
  css: {
    preprocessorOptions: {
      stylus: {
        imports: [resolve(__dirname, './src/assets/css/components/theme.scss')]
      }
    }
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          // 打包分割，拆分只打包代码模块
          if (id.includes('node_modules')) {
            return 'vendor'
          }
        }
      }
    }
  },
  base: BASE_URL,
  server: {
    port: 8082,
    host: '0.0.0.0',
    open: false, // 启动服务是否自动打开浏览器
    cors: true, // 跨域
    // 代理
    proxy: {
      '/webspider-web': {
        target: 'http://192.168.1.246:1139/webspider-web', // 测试环境
        // target: 'http://172.16.82.221:8080/webspider-web', // 何鸿飞
        changeOrigin: true,
        secure: false,
        rewrite: path => path.replace('/webspider-web/', '/')
      }
    }
  }
})
