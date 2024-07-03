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
    // '@vue/typescript/recommended',
    'prettier',
    '@vue/prettier',
    // '@vue/prettier/@typescript-eslint',
    'plugin:prettier/recommended'
  ],
  plugins: ['prettier'],
  // 对Babel解析器的包装使其与 ESLint 兼容。
  parserOptions: {
    ecmaVersion: 2020,
    parse: 'babel-eslint',
    // 代码是 ECMAScript 模块
    sourceType: 'module'
  },
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
    'prettier/prettier': 'error',
    'arrow-body-style': 'off',
    'prefer-arrow-callback': 'off',
    // 关闭名称校验
    'vue/multi-word-component-names': 'off',
    // 关闭声明未使用
    'no-unused-vars': 0
  }
}
