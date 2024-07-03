import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'
import VueSetupExtend from 'vite-plugin-vue-setup-extend'
import AutoImport from 'unplugin-auto-import/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import Components from 'unplugin-vue-components/vite'

const getCurrentDate = () => {
  const today = new Date()
  const year = today.getFullYear()
  const month = (today.getMonth() + 1).toString().padStart(2, '0')
  const day = today.getDate().toString().padStart(2, '0')
  return `${year}${month}${day}`
}

// https://vitejs.dev/config/
export default defineConfig({
  root: './src/',
  plugins: [
    vue(),
    VueSetupExtend(),
    AutoImport({
      resolvers: [ElementPlusResolver()]
    }),
    Components({
      resolvers: [ElementPlusResolver()]
    })
  ],
  // 给个默认值，防止打包成库的过程中，process.env.NODE_ENV 会被自动添加到生成的代码中
  define: {
    'process.env': {}
  },
  // publicDir: '/static',
  build: {
    lib: {
      name: 'content_scripts',
      entry: [resolve(__dirname, 'src/content_scripts/content_scripts.ts')],
      fileName: (_, entryName) => {
        return `${entryName}.js`
      }
    },
    outDir: `../website-check_${getCurrentDate()}/static/content_scripts`
  }
})
