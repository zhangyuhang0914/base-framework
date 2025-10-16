import globals from 'globals'
import pluginJs from '@eslint/js'
import tseslint from '@typescript-eslint/eslint-plugin'
import tsParser from '@typescript-eslint/parser'
import prettierPlugin from 'eslint-plugin-prettier'
import vueEslint from 'eslint-plugin-vue'
import vueParser from 'vue-eslint-parser'
import piniaEslint from 'eslint-plugin-pinia'
import eslintConfigPrettier from 'eslint-config-prettier'
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended'

/* global process */
export default [
  {
    // 配置语言选项
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.es2022,
        ...globals.node,
        ...globals.jest,
        ...globals.commonjs
      }, // 定义支持的全局变量
      parser: tsParser, // 使用 TypeScript 解析器
      parserOptions: {
        // project: ['./tsconfig.json', './tsconfig.node.json', './tsconfig.app.json'], // 指定 TypeScript 配置文件
        tsconfigRootDir: import.meta.dirname, // 设置 TypeScript 配置文件的根目录
        ecmaVersion: 'latest', // 使用最新的 ECMAScript 版本
        sourceType: 'module', // 添加 sourceType
        ecmaFeatures: {
          jsx: false // Vue 不需要 JSX
        }
      }
    }
  },
  // 引入 JavaScript
  pluginJs.configs.recommended, // JavaScript 推荐规则
  // Vue 3 相关配置
  ...vueEslint.configs['flat/recommended'],
  {
    // 配置 Vue.js 相关的插件和规则
    files: ['**/*.vue'],
    languageOptions: {
      parser: vueParser,
      parserOptions: {
        parser: tsParser,
        ecmaVersion: 'latest',
        sourceType: 'module',
        extraFileExtensions: ['.vue']
      }
    },
    plugins: {
      // Vue 推荐规则
      'vue': vueEslint,
      // Pinia 状态管理
      'pinia': piniaEslint,
      // Prettier 插件
      prettier: prettierPlugin,
    },
    rules: {
      // Vue 3 推荐规则
      'vue/multi-word-component-names': 'off', // 允许单词组件名
      'vue/no-v-html': 'off', // 允许使用 v-html
      'vue/require-default-prop': 'off', // 不强制要求默认 prop
      'vue/no-unused-vars': 'off', // 允许未使用的变量
      'vue/no-multiple-template-root': 'off', // Vue 3 允许多个根节点
      // Pinia 相关规则
      'pinia/never-export-initialized-store': 'error', // 不要导出已初始化的 store
      'pinia/prefer-single-store-per-file': 'warn', // 每个文件只有一个 store
      'prettier/prettier': 'error' // 使用 Prettier 的规则，将格式问题报告为错误
    }
  },
  {
    // 配置 JS/TS 文件的 Vue 相关规则
    files: ['**/*.js', '**/*.ts'],
    plugins: {
      // Pinia 状态管理
      'pinia': piniaEslint,
      // Prettier 插件
      prettier: prettierPlugin,
    },
    rules: {
      // Pinia 相关规则
      'pinia/never-export-initialized-store': 'error',
      'pinia/prefer-single-store-per-file': 'warn',
      'prettier/prettier': 'error'
    }
  },
  {
    // 配置全局 JavaScript 相关规则
    rules: {
      'semi': 'off', // 关闭分号规则
      'eqeqeq': 'error', // 强制使用 === 和 !== 而不是 == 和 !=
      'quotes': ['error', 'single'], // 强制使用单引号
      'no-var': 'error', // 要求使用 let 或 const 而不是 var
      'no-multiple-empty-lines': ['warn', { max: 1 }], // 不允许多个空行
      'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off', // 生产环境禁止使用 console
      'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off', // 生产环境禁止使用 debugger
      'no-unexpected-multiline': 'error', // 禁止空余的多行
      'no-useless-escape': 'off', // 禁止不必要的转义字符
      'no-multi-spaces': 'off', // 禁止出现多个连续空格（缩进和注释除外）
      'no-multiple-empty-lines': 'off', // 限制连续空行的数量（例如最多 1 行）
      'no-return-assign': 'off' // 禁止在 return 语句中使用赋值
    }
  },
  {
    // 配置 TypeScript 相关的插件和规则
    plugins: {
      files: ['**/*.ts', '**/*.tsx', '**/*.vue'],
      '@typescript-eslint': tseslint,
    },
    rules: {
      'no-unused-vars': 'off', // 允许定义未使用的变量
      '@typescript-eslint/no-unused-vars': 'off', // 禁止定义未使用的变量
      '@typescript-eslint/prefer-ts-expect-error': 'off', // 允许使用 @ts-ignore
      '@typescript-eslint/ban-ts-comment': 'off', // 允许使用 @ts-ignore
      '@typescript-eslint/no-explicit-any': 'off', // 允许使用 any 类型
      '@typescript-eslint/no-empty-object-type': 'off', // 允许空对象类型
      '@typescript-eslint/no-this-alias': 'off', // 允许使用 this 别名
      '@typescript-eslint/no-unsafe-function-type': 'off', // 允许使用 unsafe 函数类型
      '@typescript-eslint/no-non-null-assertion': 'off', // 允许使用 ! 非空断言
      '@typescript-eslint/no-unused-expressions': 'off', // 允许无用的表达式
      '@typescript-eslint/no-namespace': 'off', // 禁止使用自定义 TypeScript 模块和命名空间。
      '@typescript-eslint/semi': 'off', // 关闭 TypeScript 的分号规则 （由 Prettier 自动处理）
      '@typescript-eslint/no-shadow': 'off', // 允许变量名覆盖外层作用域的变量
      '@typescript-eslint/indent': 'off', // 强制代码缩进风格（由 Prettier 自动处理）
    }
  },
  {
    // 忽略特定目录
    ignores: [
      'node_modules/',
      'dist/',
      '*.config.js',
      'auto-imports.d.ts',
      'components.d.ts'
    ]
  },
  // 先放 eslintConfigPrettier 关闭冲突规则
  eslintConfigPrettier,
  // 使用 Prettier 推荐规则 - 用于代码格式化（必须放在最后以覆盖其他样式规则）
  eslintPluginPrettierRecommended
]
