module.exports = {
  root: true,
  env: {
    node: true,
    'vue/setup-compiler-macros': true
  },
  extends: ['plugin:vue/vue3-essential', 'eslint:recommended', '@vue/typescript/recommended', 'plugin:prettier/recommended', 'prettier', '@vue/prettier'],
  plugins: ['prettier'],
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
