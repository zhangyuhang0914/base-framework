<template>
  <AntDesginApp>
    <ConfigProvider
      :theme="{
        algorithm: getAlgorithmTheme(),
        ...antdThemeConfig
      }"
      :locale="antdLocale"
    >
      <NotificationProvider>
        <!-- 样式转换器
        hashPriority: :where 语法的兼容性在低版本浏览器比较差，如果需要支持旧版浏览器，你可以使用 @ant-design/cssinjs 取消默认的降权操作
        legacyLogicalPropertiesTransformer: 兼容旧版浏览器，请根据实际需求使用 StyleProvider 降级处理
        layer: 进行统一降权。经过降权后，antd 的样式将始终低于默认的 CSS 选择器优先级，以便于用户进行样式覆盖 -->
        <StyleProvider hash-priority="high" :transformers="transformers">
          <router-view v-slot="{ Component, route }">
            <component :is="Component" :key="route.path" />
          </router-view>
        </StyleProvider>
      </NotificationProvider>
    </ConfigProvider>
  </AntDesginApp>
</template>

<script setup lang="ts" name="App">
import { ref, computed, watchEffect, onMounted, onUnmounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useGlobalStore } from '@/store/modules/global'
import { ConfigProvider, App as AntDesginApp, theme, StyleProvider } from 'ant-design-vue'
import { legacyLogicalPropertiesTransformer } from 'ant-design-vue/es/_util/cssinjs'
import zhCN_WEB from 'ant-design-vue/es/locale/zh_CN'
import enUS_WEB from 'ant-design-vue/es/locale/en_US'
import type { Locale } from 'ant-design-vue/es/locale'
import { getBrowserLang } from '@/utils/system'
import { changeLanguage } from '@/language'
import { ThemeUtils } from '@/utils/common/themeUtils'
import { getAntdThemeConfig } from '@/constants/theme'
import { NotificationProvider } from '@/components/antd'

// 状态管理
const globalStore = useGlobalStore()
const { locale } = useI18n()

// 响应式数据
const antdThemeConfig = ref(getAntdThemeConfig())
const unsubscribe = ref<(() => void) | null>(null)
const transformers = ref([legacyLogicalPropertiesTransformer])

// 计算属性
const antdLocale = computed((): Locale => {
  const currentLanguage = globalStore.language
  if (currentLanguage === 'zh') return zhCN_WEB
  if (currentLanguage === 'en') return enUS_WEB
  if (getBrowserLang() === 'zh') return zhCN_WEB
  if (getBrowserLang() === 'en') return enUS_WEB
  return zhCN_WEB
})
// 根据 algorithmTheme 获取对应的算法
const getAlgorithmTheme = () => {
  const algorithmTheme = globalStore.algorithmTheme
  switch (algorithmTheme) {
    case 'dark':
      return theme.darkAlgorithm
    case 'compact':
      return theme.compactAlgorithm
    default:
      return theme.defaultAlgorithm
  }
}
// 应用主题色和圆角配置
const applyThemeConfig = () => {
  // 由于移除了 preferences store，这里暂时注释掉主题配置逻辑
  // 如果需要主题配置，可以从 preferencesManager 直接获取
  // const currentTheme = preferencesManager.getTheme()
  // 应用主题色
  // if (currentTheme.colorPrimary) {
  //   ThemeUtils.updateThemeColor(currentTheme.colorPrimary)
  // }
  // 应用圆角配置
  // if (currentTheme.radius) {
  //   const baseValue = parseFloat(currentTheme.radius) * 12 // 将value转换为像素值
  //   const root = document.documentElement
  //   root.style.setProperty('--border-radius-none', '0px')
  //   root.style.setProperty('--border-radius-xs', `${baseValue * 0.25}px`)
  //   root.style.setProperty('--border-radius-sm', `${baseValue * 0.5}px`)
  //   root.style.setProperty('--border-radius-md', `${baseValue * 0.75}px`)
  //   root.style.setProperty('--border-radius-lg', `${baseValue * 1.25}px`)
  //   root.style.setProperty('--border-radius-default', `${baseValue}px`)
  // }
}
// 监听语言变化
watchEffect(() => {
  const currentLanguage = globalStore.language || getBrowserLang()
  changeLanguage(currentLanguage)
  globalStore.setLanguage(currentLanguage)
  locale.value = currentLanguage
})
// 组件挂载时的初始化
onMounted(() => {
  // 初始化语言设置
  const savedLanguage = globalStore.language || getBrowserLang()
  globalStore.setLanguage(savedLanguage)
  // 应用初始主题配置
  applyThemeConfig()
  // 由于移除了 preferences store，暂时注释掉监听器
  // 如果需要监听配置变化，可以直接监听 preferencesManager
  // unsubscribe.value = preferencesManager.addListener(() => {
  //   // 实时更新主题配置
  //   applyThemeConfig()
  //   // 更新 Antd 主题配置
  //   antdThemeConfig.value = getAntdThemeConfig()
  // })
})
// 组件卸载时清理监听器
onUnmounted(() => {
  if (unsubscribe.value) {
    unsubscribe.value()
  }
})
</script>

<style scoped>
/* 组件样式 */
</style>
