module.exports = {
  // 默认情况下，ESLint会在所有父级组件中寻找配置文件，一直到根目录。ESLint一旦发现配置文件中有 "root": true，它就会停止在父级目录中寻找。
  root: true,
  env: {
    node: true,
    'vue/setup-compiler-macros': true
  },
  extends: [
    'plugin:vue/vue3-essential',
    'eslint:recommended',
    'prettier',
    '@vue/prettier',
    'plugin:prettier/recommended',
    './.eslintrc-auto-import.json' // eslint验证unplugin-auto-import自动引入的组件
  ],
  plugins: ['prettier'],
  // 对Babel解析器的包装使其与 ESLint 兼容。
  parserOptions: {
    ecmaVersion: 2020,
    parse: 'babel-eslint',
    // 代码是 ECMAScript 模块
    sourceType: 'module'
  },
  ignorePatterns: ['**/index.html'],
  // 去掉校验
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
    defineProps: 'readonly',
    defineEmits: 'readonly',
    defineExpose: 'readonly',
    withDefaults: 'readonly'
  },
  rules: {
    'prettier/prettier': 'off',
    'arrow-body-style': 'off',
    'prefer-arrow-callback': 'off',
    // 关闭名称校验
    'vue/multi-word-component-names': 'off',
    'no-useless-escape': 0,
    'no-unused-vars': 'off',
    'no-debugger': 0
  }
}