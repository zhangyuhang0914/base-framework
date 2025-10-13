import { defineConfig, loadEnv } from 'vite'
import { loadEnvConf } from './src/utils/system/env'
import vue from '@vitejs/plugin-vue'
import VueSetupSettingExtend from 'vite-plugin-vue-setup-extend'
import pug from 'vite-plugin-pug'
import { createHtmlPlugin } from 'vite-plugin-html'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { AntDesignVueResolver } from 'unplugin-vue-components/resolvers'
import tsconfigPaths from 'vite-tsconfig-paths'
import legacy from '@vitejs/plugin-legacy'
// 静态资源压缩
import VitePluginCompression from 'vite-plugin-compression'
import path from 'path'
// 引入unocss
import UnoCSS from '@unocss/vite'

// @ts-ignore
export default defineConfig(({ command, mode }) => {
  const env = loadEnv(mode, process.cwd())
  const viteEnvConf = loadEnvConf(env)
  const isBuild = command === 'build'
  return {
    plugins: [
      vue(),
      // 开启 setup 语法糖
      VueSetupSettingExtend(),
      // pug 插件
      pug(),
      // 引入unocss
      UnoCSS(),
      // html 模板
      createHtmlPlugin({
        inject: {
          data: {
            title: viteEnvConf.VITE_GLOBAL_APP_TITLE,
            description: viteEnvConf.VITE_GLOBAL_APP_DESCRIPTION,
            keywords: viteEnvConf.VITE_GLOBAL_APP_KEYWORDS,
            baseUrl: viteEnvConf.VITE_BASE_URL,
            version: viteEnvConf.VITE_GLOBAL_APP_VERSION
          }
        }
      }),
      // 自动导入相关函数
      AutoImport({
        imports: [
          'vue',
          'vue-router',
          {
            'ant-design-vue': ['message', 'notification', 'Modal']
          }
        ],
        // TS 类型声明文件
        dts: true,
        // 自动导入相关函数的 eslint 配置
        eslintrc: {
          enabled: true
        }
      }),
      // 自动导入组件
      Components({
        resolvers: [
          AntDesignVueResolver({
            importStyle: false
          })
        ],
        // TS 类型声明文件
        dts: true
      }),
      // 解析 TypeScript 路径别名
      tsconfigPaths(),
      // 兼容性处理
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
    // CSS 配置
    css: {
      modules: {
        localsConvention: 'camelCase' // 默认只支持驼峰，修改为同时支持横线和驼峰
      },
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
    // 路径别名
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src'),
        '@/assets': path.resolve(__dirname, 'src/assets'),
        '@/common': path.resolve(__dirname, 'src/common'),
        '@/components': path.resolve(__dirname, 'src/components'),
        '@/utils': path.resolve(__dirname, 'src/utils'),
        '@/plugin': path.resolve(__dirname, 'src/router'),
        '@/router': path.resolve(__dirname, 'src/router'),
        '@/store': path.resolve(__dirname, 'src/store'),
        '@/pages': path.resolve(__dirname, 'src/pages')
      },
      extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json', '.vue']
    },
    // 预构建
    esbuild: {
      // 删除console、debugger----(console.*)
      pure: viteEnvConf.VITE_DROP_CONSOLE ? ['console.log', 'debugger'] : []
    },
    // 构建配置
    build: {
      assetsDir: 'assets',
      outDir: 'dist',
      // esbuild 打包更快，但是不能去除 console.log，去除 console 使用 terser 模式
      minify: 'esbuild',
      // minify: 'terser',
      // terserOptions: {
      //   compress: {
      //     drop_console: viteEnvConf.VITE_DROP_CONSOLE as unknown as boolean, // 删除console
      //     drop_debugger: viteEnvConf.VITE_DROP_DEBUGGER as unknown as boolean // 删除debugger
      //   }
      // },
      sourcemap: !isBuild,
      rollupOptions: {
        output: {
          chunkFileNames: 'assets/js/[name]-[hash].js',
          entryFileNames: 'assets/js/[name]-[hash].js',
          assetFileNames: 'assets/[ext]/[name]-[hash].[ext]',
          manualChunks(id) {
            // 打包分割，拆分只打包代码模块
            if (id.includes('node_modules')) {
              return 'vendor'
            }
          }
        }
      },
      // 打包大小警告限制
      chunkSizeWarningLimit: 2000
    },
    // 优化配置
    optimizeDeps: {
      include: ['vue', 'vue-router', 'ant-design-vue']
    },
    // 服务器配置
    server: {
      host: viteEnvConf.VITE_HOST,
      port: viteEnvConf.VITE_PORT as unknown as number,
      open: viteEnvConf.VITE_OPEN, // 启动服务是否自动打开浏览器
      cors: viteEnvConf.VITE_CORE as unknown as boolean, // 跨域
      // 设置 http 代理
      proxy: {
        '/baseServer': {
          // target: 'https://jrb.hubei.gov.cn',
          target: 'http://172.16.50.193:8087/baseServer',
          // target: 'http://172.20.10.4:8087',
          changeOrigin: true,
          rewrite: path => path.replace(/^\/baseServer/, '')
        },
        '/fileServer': {
          // target: 'https://jrb.hubei.gov.cn',
          target: 'http://172.16.50.193:8087/fileServer',
          // target: 'http://172.20.10.4:8087',
          changeOrigin: true,
          rewrite: path => path.replace(/^\/fileServer/, '')
        }
      }
    }
  }
})
