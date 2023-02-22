<template lang="pug">
ElConfigProvider(:locale="zhCn")
  router-view(v-slot="{ Component }")
    component(:is="Component")
</template>
<script setup>
// 语言
import { storageLocal } from '@/utils/storage'
import { useI18n } from 'vue-i18n'
import zhCn from 'element-plus/lib/locale/lang/zh-cn'
import { ElConfigProvider } from 'element-plus'
// 设置i18n国际化语言
useI18n().locale.value =
  storageLocal.getItem('responsive-locale')?.locale ?? 'zh_CN'
// // 默认事件
// const firbitFn = (e) => {
//   e.preventDefault()
// }
// // 禁用右键
// document.oncontextmenu = () => {
//   return false
// }
// // 禁用拖拽
// document.addEventListener('drop', firbitFn, false)
// document.addEventListener('dragover', firbitFn, false)
</script>

<style lang="stylus">
@import './assets/css/app.styl'
</style>
