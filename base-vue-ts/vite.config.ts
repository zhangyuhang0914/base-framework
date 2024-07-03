import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'
import VueSetupExtend from 'vite-plugin-vue-setup-extend'
import ElementPlus from 'unplugin-element-plus/vite'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import VitePluginCompression from 'vite-plugin-compression'
// https://vitejs.dev/config/

// 设置文根
const BASE_URL = process.env.NODE_ENV === 'production' ? './' : '/'

export default defineConfig({
  plugins: [
    vue(),
    VueSetupExtend(),
    ElementPlus({ useSource: true }),
    AutoImport({
      imports: ['vue', 'vue-router', 'pinia'],
      // importStyle配置样式引入方式，自动引入修改主题色设置此属性
      resolvers: [ElementPlusResolver({ importStyle: 'sass' })]
    }),
    Components({
      // importStyle配置样式引入方式，自动引入修改主题色设置此属性
      resolvers: [ElementPlusResolver({ importStyle: 'sass' })]
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
  css: {
    preprocessorOptions: {
      stylus: {
        imports: [resolve(__dirname, './src/assets/css/components/theme.styl')]
      },
      scss: {
        // 自动导入定制化样式文件进行样式覆盖
        additionalData: `
          @use "@/assets/css/components/element.scss" as *;
        `
      }
    }
  },
  resolve: {
    // 设置快捷指向
    alias: {
      '@': resolve(__dirname, 'src')
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
      '/api': {
        target: 'http://202.61.90.152:28888', // 四川机关事务局-生产环境-互联网
        changeOrigin: true,
        secure: false
      }
    }
  }
})
