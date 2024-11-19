module.exports = {
  plugins: {
    autoprefixer: {
      overrideBrowserslist: [
        'Android 4.1',
        'iOS 7.1',
        'Chrome > 31',
        'ff > 31',
        'ie >= 8',
        'last 10 versions' // 所有主流浏览器最近10版本用
      ],
      grid: true
    },
    'postcss-pxtorem': {
      rootValue: 16,
      propList: ['*'],
      unitPrecision: 5
    }
    // 'postcss-pxtorem': {
    //   rootValue: 192, // 根据设计图尺寸写，设计图是1920，就写192
    //   unitPrecision: 5, //允许REM单位增长到的十进制数字,小数点后保留的位数。
    //   propList: ['*'], // 需要被转换的属性
    //   exclude: /node_modules/, // 排除文件夹
    //   mediaQuery: false //（布尔值）允许在媒体查询中转换px
    // }
  }
}
