// vue.config.js
const path = require('path')
const { name } = require('./package')
// const CompressionWebpackPlugin = require('compression-webpack-plugin')
// const productionGzipExtensions = /\.(js|css|json|txt|html|ico|svg)(\?.*)?$/i
// 生产环境根目录 -- 用于nginx上下文
const PROD_BASE_URL = '/micDispatch/'
const outputDir = 'mic-dispatch'
function resolvePath (dir) {
  return path.join(__dirname, './', dir)
}
let port = '7911'
let host = 'localhost'
// 别人访问时改成自己IP
// let host = '172.16.80.155'
module.exports = {
  // 根路径
  publicPath: process.env.NODE_ENV === 'production' ? PROD_BASE_URL : `//${host}:${port}`,
  // 静态资源文件夹
  assetsDir: 'static',
  productionSourceMap: false,
  outputDir: outputDir,
  lintOnSave: true,
  css: {
    loaderOptions: {
      postcss: {
        plugins: [
          require('postcss-plugin-px2rem')({
            rootValue: 16, // 换算基数， 默认100  ，这样的话把根标签的字体规定为1rem为50px,这样就可以从设计稿上量出多少个px直接在代码中写多上px了。
            // unitPrecision: 5, //允许REM单位增长到的十进制数字。
            // propWhiteList: [],  //默认值是一个空数组，这意味着禁用白名单并启用所有属性。
            // propBlackList: [], //黑名单
            exclude: /(pre-task)/, // 默认false，可以（reg）利用正则表达式排除某些文件夹的方法，例如/(node_module)/ 。如果想把前端UI框架内的px也转换成rem，请把此属性设为默认值
            // selectorBlackList: [], //要忽略并保留为px的选择器
            // ignoreIdentifier: false,  //（boolean/string）忽略单个属性的方法，启用ignoreidentifier后，replace将自动设置为true。
            // replace: true, // （布尔值）替换包含REM的规则，而不是添加回退。
            mediaQuery: false, // （布尔值）允许在媒体查询中转换px。
            minPixelValue: 2 // 设置要替换的最小像素值(3px会被转rem)。 默认 0
          })
        ]
      }
    }
  },
  // transpileDependencies: [ // 指定对第三方组件也进行babel-polyfill处理
  //   'element-ui',
  //   '_element-ui@2.12.0@element-ui',
  //   '_iview@3.5.4@iview',
  //   'iview',
  //   '_resize-detector@0.1.10@resize-detector',
  //   'resize-detector'
  // ],
  // pages: {
  //   index: {
  //     // page 的入口
  //     entry: ['node_modules/babel-polyfill/lib/index.js', 'src/main.js']
  //   }
  // },
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
      '@res': resolvePath('public/res'),
      '@': resolvePath('src'),
      '@data': resolvePath('public/data'),
      '@public': resolvePath('public')
      // 'vue$': 'vue/dist/vue.esm.js'
    })
    // 自定义webpack配置
    config.output = Object.assign(config.output, {
      // 把子应用打包成 umd 库格式
      library: `${name}-[name]`,
      libraryTarget: 'umd',
      jsonpFunction: `webpackJsonp_${name}`
    })

    if (process.env.NODE_ENV === 'production') {
      // 为生产环境修改配置...
      // 增加 Gzip 压缩
      // const plugins = []
      // plugins.push(
      //   new CompressionWebpackPlugin({
      //     filename: '[path].gz[query]',
      //     algorithm: 'gzip',
      //     test: productionGzipExtensions,
      //     threshold: 10240,
      //     minRatio: 0.8
      //   })
      // )
      // config.plugins = [...config.plugins, ...plugins]
    } else {
      // 为开发环境修改配置...
    }
  },
  // 本地服务器
  devServer: {
    host: '0.0.0.0', // IP
    port: port, // 端口号
    disableHostCheck: true,
    // compress: true,
    overlay: {
      warnings: false,
      errors: true
    },
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    // 代理 完整配置参考：https://github.com/chimurai/http-proxy-middleware#proxycontext-config
    proxy: {
      '/ucc_server': {
        // target: 'http://172.16.80.17:8080/icp', // 黄映龙
        // target: 'http://172.16.4.32:8889/icp', // Jenkins-陈鹏
        // target: 'http://172.16.102.151:8080/icp', // 光光
        // target: 'http://172.16.4.226:8091/ICP', // 集成环境
        target: 'http://172.16.4.226:8086/ucc_server', // 集成环境
        changeOrigin: true,
        ws: true,
        pathRewrite: {
          '^/ucc_server': ''
        }
      },
      '/fileServer': {
        target: 'http://172.16.4.32:8889/fileServer', // Jenkins-陈鹏
        // target: 'http://172.16.4.226:8091/fileServer',
        // target: 'http://172.16.80.17/fileServer', // 黄映龙
        changeOrigin: true,
        pathRewrite: {
          '^/fileServer': ''
        }
      },
      '/agentgateway': {
        target: 'http://10.20.1.217:8000',
        changeOrigin: true,
        pathRewrite: {
          '^/agentgateway': ''
        }
      },
      '/nagent': {
        target: 'http://10.20.2.22:6677/nagent',
        // target: 'http://192.168.67.18:6677/nagent',
        changeOrigin: true,
        pathRewrite: {
          '^/nagent': ''
        }
      },
      '/natsService': {
        // target: 'http://10.37.51.242:8082',
        target: 'http://172.16.4.32:8082',
        changeOrigin: true,
        pathRewrite: {
          '^/natsService': 'natsService'
        }
      },
      '/JSON_FILE': {
        target: 'http://172.16.4.32:8889/fileServer/userData', // Jenkins-陈鹏
        // target: 'http://172.16.80.17', // 黄映龙
        // target: 'http://172.16.4.226:8091', // 集成环境
        changeOrigin: true,
        // pathRewrite: {
        //   '^/JSON_FILE': 'fileServer/userData'
        // }
        pathRewrite: {
          '^/JSON_FILE': ''
        }
      }
    }
    // hot: false, // 热更
  },
  chainWebpack: config => {
    // 解决 cli3 热更新失效 https://github.com/vuejs/vue-cli/issues/1559
    config.resolve.symlinks(true)
    const types = ['vue-modules', 'vue', 'normal-modules', 'normal']
    types.forEach(type =>
      addStyleResource(config.module.rule('stylus').oneOf(type))
    )

    if (process.env.NODE_ENV === 'production') {
      config.module.rule('fonts')
        .use('url-loader')
        .loader('url-loader')
        .options({
          limit: 4096, // 小于4kb将会被打包成 base64
          fallback: {
            loader: 'file-loader',
            options: {
              name: 'fonts/[name].[hash:8].[ext]',
              publicPath: PROD_BASE_URL
            }
          }
        })
        .end()
    } else {

    }
  }

}

function addStyleResource (rule) {
  rule.use('style-resource').loader('style-resources-loader').options({
    patterns: [path.resolve(__dirname, './src/assets/css/imports.styl')]
  })
}
