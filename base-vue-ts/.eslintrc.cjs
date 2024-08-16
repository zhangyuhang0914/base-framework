// @see https://www.eslint.com.cn/docs/rules/
module.exports = {
  // 运行环境配置
  env: {
    browser: true, // eslint在浏览器端进行工作
    es2021: true, // 校验的语法
    node: true,
    jest: true
  },
  // 继承规则
  extends: [
    // 全部规则默认是关闭的,这个配置项开启推荐规则,推荐规则参照文档。比如：函数不能重名、对象不能重复key
    'eslint:recommended',
    // vue语法规则
    'plugin:vue/vue3-essential',
    // ts语法规则
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended'
  ],
  // 要为特定类型的文件制定处理器
  overrides: [],
  // 指定解析器：解析器
  // Esprima：默认解析器
  // Babel-Eslint： babel 解析器es6语法转成es5
  // @typescript-eslint/parser： ts解析器
  parser: 'vue-eslint-parser',
  // 指定解析器选项
  parserOptions: {
    ecmaVersion: 'latest', // 校验ECMA最新版本
    sourceType: 'module', // 设置为"script"（默认），或者"module"代码在ECMAScript模块中
    parser: '@typescript-eslint/parser',
    jsxPragma: 'React',
    ecmaFeatures: {
      jsx: true
    }
  },
  // eslint 支持使用第三方插件。在使用插件之前，您必须使用npm安装它
  // 该eslint-plugin-前缀可以从插件名称被省略
  plugins: ['vue', '@typescript-eslint'],
  // eslint规则
  /*
   * "off" 或 0 ：关闭规则
   * "warn" 或 1 ：打开的规则作为警告（不影响代码执行）
   * "error" 或 2 ：规则作为一个错误（代码不能执行，界面报错）
   */
  rules: {
    // eslint (https://eslint.bootcss.com/docs/rules/)
    'no-var': 'error', // 要求使用let 或 const 而不是 var
    'no-multiple-empty-lines': ['warn', { max: 1 }], // 不允许多个空行
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-unexpected-multiline': 'error', // 禁止空余的多行'
    'no-useless-escape': 'off', // 禁止不必要的转义字符
    'no-undef': 'off',
    // 'prefer-const': [ // 常量必须用const声明
    //   'off',
    //   {
    //     destructuring: 'any',
    //     ignoreReadBeforeAssign: false
    //   }
    // ],

    // typeScript (https://typescript-eslint.io/rules)
    '@typescript-eslint/no-unused-vars': 'off', // 禁止定义未使用的变量
    '@typescript-eslint/prefer-ts-expect-error': 'lint', // 禁使用 @ts-ignore
    '@typescript-eslint/no-explicit-any': 'off', // 禁止使用 any 类型

    'vue/multi-word-component-names': 'off', // 要求组件名称始终为“_”链接的单词
    'vue/script-setup-uses-vars': 'error', // 防<script setup>使用的变量<template>被标记为未使用
    'vue/no-mutating-props': 'off', // 不允许组件 prop的改变
    'vue/attribute-hyphenation': 'off' // 对模板中的自定义组件强制执行属性命名样式
  }
}
