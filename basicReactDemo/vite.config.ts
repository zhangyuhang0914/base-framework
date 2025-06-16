import { reactRouter } from '@react-router/dev/vite'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'
import tsconfigPaths from 'vite-tsconfig-paths'
// 静态资源压缩
import VitePluginCompression from 'vite-plugin-compression'
import { resolve } from 'path'

export default defineConfig({
  resolve: {
    // 设置快捷指向
    alias: {
      '@': resolve(__dirname, 'src')
    }
  },
  plugins: [
    tailwindcss(),
    reactRouter(),
    tsconfigPaths(),
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
  server: {
    port: 8086,
    host: '0.0.0.0',
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
