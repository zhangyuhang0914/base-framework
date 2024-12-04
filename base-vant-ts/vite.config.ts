import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'
import VueSetupExtend from 'vite-plugin-vue-setup-extend'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { VantResolver } from 'unplugin-vue-components/resolvers'
import viteLegacyPlugin from '@vitejs/plugin-legacy'

// 设置文根
const BASE_URL = process.env.NODE_ENV === 'production' ? './' : '/'

// https://vitejs.dev/config/
export default ({ command, mode }: any) => {
  // 根据当前工作目录中的 `mode` 加载 .env 文件
  // 设置第三个参数为 '' 来加载所有环境变量，而不管是否有 `VITE_` 前缀。
  const env = loadEnv(mode, process.cwd(), '') || {}
  // console.log('command', command)
  // console.log('mode', mode)
  // console.log(loadEnv(mode, process.cwd(), ''))
  return defineConfig({
    plugins: [
      vue(),
      VueSetupExtend(),
      AutoImport({
        resolvers: [VantResolver()]
      }),
      Components({
        /**
         * importStyle: 自动导入组件的时候不导入组件的样式（避免样式重复）
         * https://github.com/antfu/unplugin-vue-components#importstyle
         */
        resolvers: [VantResolver({ importStyle: false })]
      }),
      viteLegacyPlugin({
        targets: ['chrome 52', 'ie >= 11'], // 需要兼容的目标列表，可以设置多个
        additionalLegacyPolyfills: ['regenerator-runtime/runtime'] // 面向IE11时需要此插件
      })
    ],
    css: {
      preprocessorOptions: {
        stylus: {
          imports: [
            resolve(__dirname, './src/assets/css/components/theme.styl')
          ]
        }
      }
    },
    resolve: {
      // 设置快捷指向
      alias: {
        '@': resolve(__dirname, './src')
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
      port: 8086,
      host: '0.0.0.0',
      open: false, // 启动服务是否自动打开浏览器
      cors: true, // 跨域
      proxy: {
        //配置自定义代理规则
        [env.VITE_APP_BASE_API]: {
          target: env.VITE_APP_DEV_URL,
          changeOrigin: true,
          rewrite: path =>
            path.replace(new RegExp('^' + env.VITE_APP_BASE_API), '')
        }
        // '/api': {
        //   target: 'http://192.168.0.144:7010',
        //   changeOrigin: true, //是否跨域
        //   rewrite: path => path.replace(/^\/api/, '')
        // }
      }
    }
  })
}
