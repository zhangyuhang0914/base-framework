// vue.config.js
const { defineConfig } = require('@vue/cli-service')
const path = require('path')
const packageName = require('./package.json').name
const UglifyJsPlugin = require('terser-webpack-plugin')

console.log('packageName', packageName)
// 生产环境根目录 -- 用于nginx上下文
const PROD_BASE_URL = '/mic-pc-dispatch/'
const outputDir = 'mic-pc-dispatch'
let port = '8082'
let host = 'localhost'
const publicPath = process.env.NODE_ENV === 'production' ? PROD_BASE_URL : `//${host}:${port}`

module.exports = defineConfig({
  // 根路径
  publicPath: publicPath,
  // 静态资源文件夹
  assetsDir: 'static',
  productionSourceMap: false,
  outputDir: outputDir,
  lintOnSave: true,
  transpileDependencies: true,
  // 打包方式设置为umd
  configureWebpack: config => {
    if (process.env.NODE_ENV === 'development') {
      config.devtool = 'source-map'
    }
    // 警告 webpack 的性能提示
    config.performance = {
      hints: 'warning',
      // 入口起点的最大体积 整数类型（以字节为单位）
      maxEntrypointSize: 50000000,
      // 生成文件的最大体积 整数类型（以字节为单位 300k）
      maxAssetSize: 30000000,
      // 只给出 js 文件的性能提示
      assetFilter: function (assetFilename) {
        return assetFilename.endsWith('.js')
      }
    }
    config.resolve.alias = Object.assign(config.resolve.alias, {
      '@': resolvePath('src')
    })
    // 自定义webpack配置
    config.output = Object.assign(config.output, {
      // 把子应用打包成 umd 库格式
      library: `${packageName}`,
      libraryTarget: 'umd',
      // jsonpFunction: `webpackJsonp_${packageName}`,
      globalObject: 'window'
    })
    if (process.env.NODE_ENV === 'production') {
      config.plugins.push(
        new UglifyJsPlugin({
          terserOptions: {
            warnings: false,
            compress: {
              drop_debugger: true, // console
              drop_console: true,
              pure_funcs: ['console.log'] // 移除console
            }
          },
          exclude: /\/node_modules/,
          sourceMap: false,
          parallel: true
        })
      )
    } else {
      // 为开发环境修改配置...
    }
  },
  // 本地服务器
  devServer: {
    host: '0.0.0.0', // IP
    port: port, // 端口号
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    // 代理 完整配置参考：https://github.com/chimurai/http-proxy-middleware#proxycontext-config
    proxy: {
      '/jgswappms': {
        // target: 'http://59.225.205.32:8888', // 四川机关事务局-生产环境-内网
        target: 'http://202.61.90.152:28888', // 四川机关事务局-生产环境-互联网
        changeOrigin: true,
        secure: false
      }
    }
  },
  chainWebpack: config => {
    // 解决 cli3 热更新失效 https://github.com/vuejs/vue-cli/issues/1559
    config.resolve.symlinks(true)
    const types = ['vue-modules', 'vue', 'normal-modules', 'normal']
    types.forEach(type => addStyleResource(config.module.rule('stylus').oneOf(type)))
    config.module
      .rule('fonts')
      .use('url-loader')
      .loader('url-loader')
      .options({
        limit: 4096, // 小于4kb将会被打包成 base64
        fallback: {
          loader: 'file-loader',
          options: {
            name: 'fonts/[name].[hash:8].[ext]',
            publicPath: publicPath
          }
        }
      })
      .end()
    config.module
      .rule('images')
      .use('url-loader')
      .loader('url-loader')
      .options({
        limit: 4096, // 小于4kb将会被打包成 base64
        fallback: {
          loader: 'file-loader',
          options: {
            esModule: false,
            name: 'img/[name].[hash:8].[ext]',
            publicPath
          }
        }
      })
  }
})

function resolvePath (dir) {
  return path.join(__dirname, './', dir)
}
function addStyleResource (rule) {
  rule
    .use('style-resource')
    .loader('style-resources-loader')
    .options({
      patterns: [path.resolve(__dirname, './src/assets/css/imports.styl')]
    })
}
