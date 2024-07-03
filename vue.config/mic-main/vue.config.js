/*
 * @Desc: vue 配置文件
 * @Author: Mr.Chen
 * @LastEditors: Mr.Chen
 * @LastEditTime: 2021-03-04 18:41:43
 */
const path = require('path')
const resolvePath = dir => path.join(__dirname, './', dir)
const PROD_BASE_URL = '/'
module.exports = {
  publicPath: process.env.NODE_ENV === 'production' ? PROD_BASE_URL : '/',
  productionSourceMap: false,
  configureWebpack: config => {
    if (process.env.NODE_ENV === 'development') {
      // #cheap-module-eval-source-map  source-map
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
      '@public': resolvePath('public'),
      vue$: 'vue/dist/vue.esm.js'
    })
  },
  chainWebpack: config => {
    // 修复HMR
    config.resolve.symlinks(true)
  },
  devServer: {
    host: '0.0.0.0', // IP
    port: 9999, // 端口号
    disableHostCheck: true,
    // compress: true,
    overlay: {
      warnings: false,
      errors: true
    },
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': '*',
      'Access-Control-Allow-Headers': '*'
    },
    proxy: {
      '/icpServer': {
        // target: 'http://172.16.80.119:8081/icp', // 黄映龙
        // target: 'http://172.16.4.32:8889/icp', // Jenkins-陈鹏
        // target: 'http://172.16.102.151:8080/icp', // 光光
        // target: 'http://172.16.4.226:8091/ICP', // 集成环境
        // target: 'http://172.16.80.48:8080/icp', // 陈世
        // target: 'http://172.16.80.148:8081/icp',
        // target: 'http://172.16.102.127:8081/icp', // 雷奇
        // target: 'http://172.16.4.226:8086/icpServer', // 集成环境
        // target: 'http://172.16.4.78:8081/ucc_server', // 集成环境
        target: 'http://172.16.7.97:82/icpServer', // 集成环境
        // target: 'http://172.16.4.228:80/icpServer', // 集成环境
        changeOrigin: true,
        ws: true,
        pathRewrite: {
          '^/icpServer': ''
        }
      },
      '/iccServer': { // webserve 服务
        target: 'http://172.16.4.76/iccServer', // 中台2.0-开发环境
        // target: 'http://172.16.4.228/iccServer', // 中台2.0-测试环境
        // target: 'http://172.16.4.228:80/iccServer', // 集成环境
        changeOrigin: true,
        pathRewrite: {
          '^/iccServer': ''
        }
      },
      '/icpJsonFile': {
        // target: 'http://172.16.4.32',
        target: 'http://172.16.4.226:8086/icpJsonFile', // Jenkins-陈鹏
        // target: 'http://172.16.80.92:8080', // 黄映龙
        // target: 'http://172.16.4.226:8091', // 集成环境
        changeOrigin: true,
        pathRewrite: {
          '^/icpJsonFile': ''
        }
      },
      '/fileServer': {
        // target: 'http://172.16.4.32',
        // target: 'http://172.16.4.32:8889/fileServer', // Jenkins-陈鹏
        // target: 'http://172.16.80.92:8080', // 黄映龙
        target: 'http://172.16.4.226:8086/fileServer', // 集成环境
        changeOrigin: true,
        pathRewrite: {
          '^/fileServer': ''
        }
      },
      '/natsServer': {
        // target: 'http://10.37.51.242:8082',
        target: 'http://172.16.4.226:8086/natsServer',
        changeOrigin: true,
        pathRewrite: {
          '^/natsServer': ''
        }
      }
    }
  }
}
