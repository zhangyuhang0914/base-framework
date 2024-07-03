<template lang="pug">
.richContent
  mpHtml(:content='contentHtml' :scroll-table='true')
</template>

<script setup lang="ts">
import { computed } from 'vue'
import mpHtml from '@/components/mp-html/mp-html.vue'
const props = defineProps({
  // 用于渲染的 html 字符串
  content: {
    type: String,
    default: ''
  }
})
const contentHtml = computed(() => {
  return fmtContent(props.content)
})
const fmtContent = (data: string) => {
  let html = data
  // 重置h1标签
  data = data.replaceAll('h1', 'h5')
  return data
}
</script>

<style lang="stylus" scoped>
@import './index.styl'
</style>
