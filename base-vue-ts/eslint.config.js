import globals from 'globals'
import pluginJs from '@eslint/js'
import tseslint from 'typescript-eslint'
import pluginVue from 'eslint-plugin-vue'
import VueEslintParser from 'vue-eslint-parser'
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended'

/* global process */
export default [
  {
    // 配置语言选项
    languageOptions: {
      globals: [globals.browser, globals.es2022, globals.node, globals.jest] // 定义支持的全局变量
    }
  },
  // 引入 JavaScript 和 TypeScript 推荐规则
  pluginJs.configs.recommended, // JavaScript 推荐规则
  ...tseslint.configs.recommended, // TypeScript 推荐规则
  ...pluginVue.configs['flat/essential'], // Vue.js 基本规则
  {
    // 配置 Vue.js 相关的插件和规则
    plugins: {
      pluginVue: pluginVue
    },
    rules: {
      'vue/multi-word-component-names': 'off', // 要求组件名称始终为 “-” 链接的单词
      'vue/script-setup-uses-vars': 'error', // 防止<script setup>使用的变量<template>被标记为未使用
      'vue/no-mutating-props': 'off', // 允许组件 prop的改变
      'vue/attribute-hyphenation': 'off' // 关闭强制自定义组件属性命名样式的规则
    }
  },
  {
    // 配置 TypeScript 相关的插件和规则
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
    // 全局 JavaScript 相关规则
    rules: {
      'no-var': 'error', // 要求使用 let 或 const 而不是 var
      'no-multiple-empty-lines': ['warn', { max: 1 }], // 不允许多个空行
      'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off', // 生产环境禁止使用 console
      'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off', // 生产环境禁止使用 debugger
      'no-unexpected-multiline': 'error', // 禁止空余的多行
      'no-useless-escape': 'off' // 禁止不必要的转义字符
    }
  },
  {
    // 配置语言选项
    languageOptions: {
      parser: VueEslintParser, // 使用 Vue 解析器
      ecmaVersion: 'latest', // ECMAScript 最新版本
      sourceType: 'module', // 使用模块化的代码
      parserOptions: {
        parser: '@typescript-eslint/parser' // 使用 TypeScript 解析器
      }
    }
  },
  {
    // 忽略特定目录
    ignores: ['node_modules/', 'dist/']
  },
  // 使用 Prettier 推荐规则
  eslintPluginPrettierRecommended
]
