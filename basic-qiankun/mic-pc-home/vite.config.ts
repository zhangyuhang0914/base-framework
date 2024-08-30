import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'
import VueSetupExtend from 'vite-plugin-vue-setup-extend'
import qiankun from 'vite-plugin-qiankun'
import ElementPlus from 'unplugin-element-plus/vite'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import ViteImages from 'vite-plugin-vue-images'
// https://vitejs.dev/config/

// 设置文根 用于nginx上下文
const BASE_URL = '/mic-pc-home/'
let port: any = '8081'
let host: any = 'localhost'
const publicPath: string = process.env.NODE_ENV === 'production' ? BASE_URL : `//${host}:${port}`
// useDevMode 开启时与热更新插件冲突
// 如果是在主应用中加载子应用vite,必须打开这个,否则vite加载不成功, 单独运行没影响
const useDevMode = true

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd())
  const config = {
    plugins: [
      vue(),
      VueSetupExtend(),
      qiankun('mic-pc-home', { useDevMode }),
      ElementPlus(),
      AutoImport({
        imports: ['vue', 'vue-router', 'pinia'],
        resolvers: [ElementPlusResolver()]
      }),
      Components({
        resolvers: [ElementPlusResolver()]
      }),
      ViteImages({
        dirs: ['src/assets/images'] // 指明图片存放目录
      })
    ],
    css: {
      preprocessorOptions: {
        stylus: {
          imports: [resolve(__dirname, './src/assets/css/components/theme.styl')]
        }
      }
    },
    resolve: {
      // 设置快捷指向
      alias: {
        '@': resolve(__dirname, 'src')
      }
    },
    build: {
      commonjsOptions: {
        transformMixedEsModules: true
      }
    },
    define: {
      'process.env': env
    },
    base: BASE_URL,
    server: {
      origin: publicPath,
      port: port,
      host: '0.0.0.0',
      https: false,
      open: false, // 启动服务是否自动打开浏览器
      cors: true, // 跨域
      // 代理
      proxy: {
        '/jgswappms': {
          // target: 'http://59.225.205.32:8888', // 四川机关事务局-生产环境-内网
          target: 'http://202.61.90.152:28888', // 四川机关事务局-生产环境-互联网
          changeOrigin: true,
          secure: false
        }
      }
    }
  }
  return config
})
