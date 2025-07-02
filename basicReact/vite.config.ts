import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react-swc'
import tsconfigPaths from 'vite-tsconfig-paths'
import legacy from '@vitejs/plugin-legacy'
// 静态资源压缩
import VitePluginCompression from 'vite-plugin-compression'
import path from 'path'

// @ts-ignore
export default ({ mode }) => {
  console.log('环境变量', loadEnv(mode, process.cwd()).VITE_APP_ENV)
  return defineConfig({
    plugins: [
      // SWC编译器
      react(),
      // 解析 TypeScript 路径别名
      tsconfigPaths(),
      legacy({
        targets: ['defaults', 'not IE 11', 'chrome 52'], // 需要兼容的目标列表，可以设置多个
        modernPolyfills: true, //启用现代浏览器 polyfills
        renderLegacyChunks: false, // 禁用旧版本代码块生成
        additionalLegacyPolyfills: ['regenerator-runtime/runtime'] // 面向IE11时需要此插件
      }),
      // 静态资源压缩
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
        '@': path.resolve(__dirname, 'src'),
        '@assets': path.resolve(__dirname, 'src/assets'),
        '@components': path.resolve(__dirname, 'src/components'),
        '@utils': path.resolve(__dirname, 'src/utils'),
        '@redux': path.resolve(__dirname, 'src/redux'),
        '@pages': path.resolve(__dirname, 'src/pages')
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
}
