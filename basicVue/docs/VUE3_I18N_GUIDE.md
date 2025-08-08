# Vue3 国际化 (vue-i18n) 使用指南

本指南详细介绍了如何在 Vue3 项目中使用 vue-i18n 进行国际化配置和开发。

## 📦 已安装依赖

```json
{
  "vue-i18n": "^9.14.5"
}
```

## 🏗️ 项目结构

```
src/
├── language/                 # 国际化配置目录
│   ├── index.ts             # 主配置文件
│   ├── interface/           # 类型定义
│   │   └── index.ts         # 语言类型定义
│   └── modules/             # 语言模块
│       ├── zh-CN.ts         # 中文翻译
│       └── en-US.ts         # 英文翻译
├── components/
│   └── I18nExample.vue      # 国际化示例组件
└── main.ts                  # 应用入口文件
```

## ⚙️ 配置说明

### 1. 主配置文件 (`src/language/index.ts`)

```typescript
import { createI18n } from 'vue-i18n'
import zhCnTrans from './modules/zh-CN'
import enUsTrans from './modules/en-US'
import type { LanguageKey } from './interface'

// 语言资源配置
const messages = {
  zh: zhCnTrans,
  en: enUsTrans
}

// 创建 i18n 实例
const i18n = createI18n({
  legacy: false,              // 使用组合式 API 模式
  locale: 'zh',              // 默认语言
  fallbackLocale: 'en',      // 回退语言
  messages,                  // 语言资源
  globalInjection: true,     // 全局注入 $t 函数
  silentTranslationWarn: true // 静默翻译警告
})

// 导出翻译函数
export const $t = i18n.global.t

// 导出语言切换函数
export const changeLanguage = (lang: LanguageKey): void => {
  i18n.global.locale.value = lang
  // 可以在这里添加其他语言切换逻辑，如保存到 localStorage
  localStorage.setItem('language', lang)
}

// 导出获取当前语言函数
export const getCurrentLanguage = (): LanguageKey => {
  return i18n.global.locale.value as LanguageKey
}

// 导出获取所有可用语言函数
export const getAvailableLanguages = (): LanguageKey[] => {
  return Object.keys(messages) as LanguageKey[]
}

export default i18n
```

### 2. 类型定义 (`src/language/interface/index.ts`)

```typescript
// 支持的语言类型
export type LanguageKey = 'en' | 'zh'
```

### 3. 语言模块示例

**中文模块 (`src/language/modules/zh-CN.ts`)**:
```typescript
const zhCnTrans = {
  welcome: '欢迎使用',
  notData: '暂无数据',
  greeting: '你好，{name}！',
  itemCount: '没有项目 | {count} 个项目 | {count} 个项目',
  language: {
    chinese: '中文',
    english: '英文'
  },
  common: {
    confirm: '确认',
    cancel: '取消',
    save: '保存',
    // ... 更多通用翻译
  }
}

export default zhCnTrans
```

**英文模块 (`src/language/modules/en-US.ts`)**:
```typescript
const enUsTrans = {
  welcome: 'Welcome',
  notData: 'No Data',
  greeting: 'Hello, {name}!',
  itemCount: 'no items | {count} item | {count} items',
  language: {
    chinese: 'Chinese',
    english: 'English'
  },
  common: {
    confirm: 'Confirm',
    cancel: 'Cancel',
    save: 'Save',
    // ... 更多通用翻译
  }
}

export default enUsTrans
```

### 4. 应用注册 (`src/main.ts`)

```typescript
import { createApp } from 'vue'
import App from './App.vue'
import i18n from '@/language'

const app = createApp(App)

// 注册 vue-i18n
app.use(i18n)

app.mount('#app')
```

## 🚀 使用方法

### 1. 在模板中使用

```vue
<template>
  <!-- 基础翻译 -->
  <div>{{ $t('welcome') }}</div>
  
  <!-- 带参数的翻译 -->
  <div>{{ $t('greeting', { name: 'Vue3' }) }}</div>
  
  <!-- 复数形式 -->
  <div>{{ $t('itemCount', count, { count }) }}</div>
  
  <!-- 嵌套翻译 -->
  <div>{{ $t('language.chinese') }}</div>
</template>
```

### 2. 在组合式 API 中使用

```vue
<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { computed } from 'vue'

// 获取 i18n 实例
const { t, locale } = useI18n()

// 使用翻译函数
const welcomeMessage = computed(() => t('welcome'))

// 切换语言
const switchLanguage = (lang: string) => {
  locale.value = lang
}
</script>
```

### 3. 在选项式 API 中使用

```vue
<script>
export default {
  methods: {
    getMessage() {
      return this.$t('welcome')
    },
    
    switchLanguage(lang) {
      this.$i18n.locale = lang
    }
  },
  
  computed: {
    currentLanguage() {
      return this.$i18n.locale
    }
  }
}
</script>
```

### 4. 在 JavaScript/TypeScript 文件中使用

```typescript
import { $t, changeLanguage, getCurrentLanguage } from '@/language'

// 获取翻译文本
const message = $t('welcome')

// 切换语言
changeLanguage('en')

// 获取当前语言
const currentLang = getCurrentLanguage()
```

## 🎯 高级功能

### 1. 插值翻译

```typescript
// 语言文件
const messages = {
  greeting: 'Hello, {name}!',
  userInfo: 'User {name} has {count} messages'
}

// 使用
$t('greeting', { name: 'John' })           // "Hello, John!"
$t('userInfo', { name: 'John', count: 5 }) // "User John has 5 messages"
```

### 2. 复数形式

```typescript
// 语言文件
const messages = {
  itemCount: 'no items | one item | {count} items'
}

// 使用
$t('itemCount', 0)  // "no items"
$t('itemCount', 1)  // "one item"
$t('itemCount', 5)  // "5 items"
```

### 3. 日期时间格式化

```typescript
// 在组件中
const formatDate = (date: Date): string => {
  const locale = getCurrentLanguage() === 'zh' ? 'zh-CN' : 'en-US'
  return new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(date)
}
```

### 4. 数字格式化

```typescript
// 在组件中
const formatNumber = (num: number): string => {
  const locale = getCurrentLanguage() === 'zh' ? 'zh-CN' : 'en-US'
  return new Intl.NumberFormat(locale).format(num)
}
```

## 🛠️ 最佳实践

### 1. 翻译键命名规范

```typescript
// ✅ 推荐：使用层级结构
const messages = {
  common: {
    button: {
      save: '保存',
      cancel: '取消'
    }
  },
  user: {
    profile: {
      title: '用户资料',
      name: '姓名'
    }
  }
}

// ❌ 不推荐：扁平结构
const messages = {
  commonButtonSave: '保存',
  commonButtonCancel: '取消',
  userProfileTitle: '用户资料'
}
```

### 2. 类型安全

```typescript
// 定义翻译键类型
type TranslationKeys = 
  | 'welcome'
  | 'common.save'
  | 'common.cancel'
  | 'user.profile.title'

// 使用类型安全的翻译函数
const safeT = (key: TranslationKeys, params?: any) => $t(key, params)
```

### 3. 懒加载语言包

```typescript
// 动态导入语言包
const loadLanguage = async (lang: string) => {
  const messages = await import(`./modules/${lang}.ts`)
  i18n.global.setLocaleMessage(lang, messages.default)
  return messages.default
}
```

### 4. 语言持久化

```typescript
// 保存语言设置到 localStorage
export const changeLanguage = (lang: LanguageKey): void => {
  i18n.global.locale.value = lang
  localStorage.setItem('language', lang)
  
  // 可选：设置 HTML lang 属性
  document.documentElement.lang = lang
}

// 应用启动时恢复语言设置
const savedLanguage = localStorage.getItem('language') as LanguageKey
if (savedLanguage && ['zh', 'en'].includes(savedLanguage)) {
  i18n.global.locale.value = savedLanguage
}
```

## 🔧 开发工具

### 1. VS Code 扩展推荐

- **i18n Ally**: 提供翻译预览和管理功能
- **Vue Language Features (Volar)**: Vue3 官方语言支持

### 2. 翻译文件验证

```typescript
// 验证翻译完整性的工具函数
const validateTranslations = () => {
  const languages = ['zh', 'en']
  const baseKeys = Object.keys(messages.zh)
  
  languages.forEach(lang => {
    const langKeys = Object.keys(messages[lang])
    const missingKeys = baseKeys.filter(key => !langKeys.includes(key))
    
    if (missingKeys.length > 0) {
      console.warn(`Missing translations in ${lang}:`, missingKeys)
    }
  })
}
```

## 📝 示例组件

项目中包含了一个完整的国际化示例组件 `I18nExample.vue`，展示了：

- 基础翻译使用
- 语言切换功能
- 插值翻译
- 复数形式
- 日期时间格式化
- 使用指南

可以在应用中查看该组件来了解具体的使用方法。

## 🚨 注意事项

1. **性能优化**: 对于大型应用，考虑使用懒加载来减少初始包大小
2. **SEO 友好**: 确保为不同语言设置正确的 HTML lang 属性
3. **RTL 支持**: 如需支持阿拉伯语等从右到左的语言，需要额外配置
4. **翻译质量**: 建议使用专业翻译服务，避免机器翻译的不准确性
5. **测试覆盖**: 为国际化功能编写单元测试，确保翻译正确性

## 📚 相关资源

- [Vue I18n 官方文档](https://vue-i18n.intlify.dev/)
- [Vue3 组合式 API](https://vuejs.org/guide/extras/composition-api-faq.html)
- [国际化最佳实践](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl)