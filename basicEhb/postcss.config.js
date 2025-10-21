export default {
  plugins: {
    autoprefixer: {
      overrideBrowserslist: [
        "Android 4.1",
        "iOS 7.1",
        "Chrome > 31",
        "ff > 31",
        "ie >= 8",
        "last 10 versions", // 所有主流浏览器最近10版本用
      ],
      grid: true,
    },
    'postcss-pxtorem': {
      rootValue: 37.5,
      // rootValue({ file }) {
      //   return file.indexOf('vant') !== -1 ? 37.5 : 75;
      // },
      propList: ['*'],
      selectorBlackList: [],
      exclude: /node_modules/i,
      replace: true,
      mediaQuery: false,
      minPixelValue: 0
    }
  },
}
