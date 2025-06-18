import { defineConfig } from 'vite'
import tsconfigPaths from 'vite-tsconfig-paths'
// 静态资源压缩
import VitePluginCompression from 'vite-plugin-compression'
import { resolve } from 'path'

export default defineConfig({
  plugins: [
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
  css: {
    preprocessorOptions: {
      scss: {
        // 启用现代API
        api: 'modern-compiler',
        // 每个引入scss文件时，自动引入公共样式（导出全局变量和 mixin）
        additionalData: `@use "@/assets/css/components/theme.scss" as *;`,
        // 静默特定弃用警告
        silenceDeprecations: ['legacy-js-api']
      }
    }
  },
  resolve: {
    // 设置快捷指向
    alias: {
      '@': resolve(__dirname, 'src'),
      '@assets': resolve(__dirname, 'src/assets'),
      '@components': resolve(__dirname, 'src/components'),
      '@utils': resolve(__dirname, 'src/utils'),
      '@redux': resolve(__dirname, 'src/redux')
    },
    extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json', '.vue']
  },
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
