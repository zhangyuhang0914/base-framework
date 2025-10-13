export default {
  plugins: {
    '@unocss/postcss': {},
    'postcss-pxtorem': {
      rootValue: 16,
      propList: ['*'],
      selectorBlackList: []
    }
  },
}
