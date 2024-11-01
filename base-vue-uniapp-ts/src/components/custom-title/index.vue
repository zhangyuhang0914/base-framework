<template lang="pug">
.c-common-header
  .c-handle-box
    .c-tips
    .c-title(:style="{ color: headerColor }") {{ title || '' }}
    i.iconfont(v-if="icon" :class="icon" :style="{ color: iconColor }")
  .c-more(v-if="showMore" @click="$emit('onClickMore')")
    span.more {{ '查看更多' }}
    u-icon.icon-right(name="arrow-right")
  .slot-box(v-else)
    slot(name='right')
</template>

<script>
import { defineComponent } from 'vue'
export default defineComponent({
  name: 'CCommonHeader',
  props: {
    title: {
      type: String,
      default: ''
    },
    showMore: {
      type: Boolean,
      default: false
    },
    icon: {
      type: String,
      default: ''
    },
    headerColor: {
      type: String,
      default: '#333'
    },
    iconColor: {
      type: String,
      default: ''
    }
  },
  emits: ['onClickMore']
})
</script>

<style lang="stylus" scoped>
@import './index.styl'
</style>
