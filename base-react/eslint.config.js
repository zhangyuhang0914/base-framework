import pluginJs from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import tsParser from '@typescript-eslint/parser'
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended'

export default [
  {
    // 配置语言选项
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.es2022,
        ...globals.node,
        ...globals.jest
      }
    }
  },
  // 引入 JavaScript 和 TypeScript 推荐规则
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  // 配置react环境
  {
    settings: {
      react: '18.3'
    },
    plugins: {
      'react-hooks': reactHooks, // 注册 React Hooks 插件，用于检查 Hooks 规则
      'react-refresh': reactRefresh // 注册 React Refresh 插件，用于开发环境下的热更新
    },
    rules: {
      'react/multi-word-component-names': 'off', // 要求组件名称始终为 “-” 链接的单词
      'react/no-mutating-props': 'off', // 不允许组件 prop的改变
      'react/attribute-hyphenation': 'off', // 对模板中的自定义组件强制执行属性命名样式
      'react-refresh/only-export-components': [
        'warn', // 警告：限制只导出组件，用于 React Refresh 的热更新
        { allowConstantExport: true } // 允许导出常量
      ],
      // React hooks 规则
      ...reactHooks.configs.recommended.rules // 加载 React Hooks 插件推荐的规则
    }
  },
  {
    // 插件配置
    plugins: {
      tseslint: tseslint // 注册 TypeScript ESLint 插件，用于检查 TypeScript 规则
    },
    // 自定义规则配置
    rules: {
      // '@typescript-eslint/no-unused-vars': 'error', // 禁止定义未使用的变量
      '@typescript-eslint/no-unused-vars': 'off', // 允许定义未使用的变量
      '@typescript-eslint/prefer-ts-expect-error': 'off', // 允许使用 @ts-ignore
      '@typescript-eslint/ban-ts-comment': 'off', // 允许使用 @ts-ignore
      '@typescript-eslint/no-explicit-any': 'off', // 禁止使用 any 类型
      '@typescript-eslint/no-empty-object-type': 'off', // 允许空对象类型
      '@typescript-eslint/no-this-alias': 'off', // 允许使用 this 别名
      '@typescript-eslint/no-unsafe-function-type': 'off', // 允许使用 unsafe 函数类型
      '@typescript-eslint/no-non-null-assertion': 'off', // 允许使用 ! 非空断言
      '@typescript-eslint/no-unused-expressions': 'off', // 允许无用的表达式
      '@typescript-eslint/no-namespace': 'off', // 禁止使用自定义 TypeScript 模块和命名空间。
      '@typescript-eslint/semi': 'off'
    }
  },
  // 针对特定文件的规则覆盖
  {
    rules: {
      'no-var': 'error', // 要求使用 let 或 const 而不是 var
      'no-multiple-empty-lines': ['warn', { max: 1 }], // 不允许多个空行
      'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
      'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
      'no-unexpected-multiline': 'error', // 禁止空余的多行
      'no-useless-escape': 'off' // 禁止不必要的转义字符
    }
  },
  {
    // 配置语言选项
    languageOptions: {
      ecmaVersion: 'latest', // 使用 ECMAScript 最新版本
      sourceType: 'module', // 指定代码模块化类型为 ES 模块
      parser: tsParser, // 使用 TypeScript 解析器解析 TS 文件
      parserOptions: {
        parser: '@typescript-eslint/parser'
      }
    }
  },
  {
    // 忽略特定文件和文件夹，防止 ESLint 检查这些文件
    ignores: ['node_modules/**', 'dist/**']
  },
  // 放在最后为了防止被其他规则覆盖
  eslintPluginPrettierRecommended
]
