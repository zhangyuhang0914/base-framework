<template lang="pug">
.layout-header
  template(v-if="layout === 'default'")
    slot
  template(v-if="layout === 'title'")
    .title
      | {{title}}
      slot
    van-icon.fanhui.back(name="arrow-left" @click="toBack" v-if="back")
    slot(name="actions")
</template>

<script>
import { defineComponent } from 'vue'
export default defineComponent({
  name: 'cHeader',
  props: {
    layout: {
      type: [String],
      default: 'title'
    },
    // 是否显示返回按钮
    back: {
      type: [Boolean],
      default: false
    },
    title: {
      type: [String],
      default: ''
    }
  }
})
</script>

<style lang="stylus" scoped>
@import './index.styl'
</style>
