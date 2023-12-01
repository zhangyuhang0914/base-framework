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
    '@vue/typescript/recommended',
    'prettier',
    '@vue/prettier',
    '@vue/prettier/@typescript-eslint',
  ],
  plugins: ['prettier'],
  // 对Babel解析器的包装使其与 ESLint 兼容。
  parserOptions: {
    ecmaVersion: 2020,
    parse: '@typescript-eslint/parser',
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
    '@typescript-eslint/no-unused-vars': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    /*关闭驼峰命名规则*/
    'vue/multi-word-component-names': 0,
    'prefer-const': [
      'off',
      {
        destructuring: 'any',
        ignoreReadBeforeAssign: false
      }
    ],
    '@typescript-eslint/ban-ts-comment': 'off' // 禁使用 @ts-ignore
  }
}
