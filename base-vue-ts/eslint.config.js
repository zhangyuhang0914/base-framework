import globals from 'globals'
import pluginJs from '@eslint/js'
import tseslint from 'typescript-eslint'
import pluginVue from 'eslint-plugin-vue'
import VueEslintParser from 'vue-eslint-parser'
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended'

/* global process */
export default [
  {
    languageOptions: {
      globals: [globals.browser, globals.es2022, globals.node, globals.jest]
    }
  },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  ...pluginVue.configs['flat/essential'],

  {
    plugins: {
      pluginVue: pluginVue
    },
    rules: {
      'vue/multi-word-component-names': 'off', // 要求组件名称始终为 “-” 链接的单词
      'vue/script-setup-uses-vars': 'error', // 防止<script setup>使用的变量<template>被标记为未使用
      'vue/no-mutating-props': 'off', // 不允许组件 prop的改变
      'vue/attribute-hyphenation': 'off' // 对模板中的自定义组件强制执行属性命名样式
    }
  },
  {
    plugins: {
      tseslint: tseslint
    },
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
    languageOptions: {
      parser: VueEslintParser,
      ecmaVersion: 'latest',
      sourceType: 'module',
      parserOptions: {
        parser: '@typescript-eslint/parser'
      }
    }
  },
  {
    ignores: ['node_modules/', 'dist/']
  },
  eslintPluginPrettierRecommended
]
