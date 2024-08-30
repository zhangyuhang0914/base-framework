<template lang="pug">
.c-select
  el-select(
    v-model="value"
    placeholder="请选择"
    :style="{width: width || '100%'}"
    :clearable="clearable"
    v-bind="$attrs"
  )
    el-option(
      v-for="(item, index) in optionSource"
      :key="index + '_i'"
      :label="item.label"
      :value="item.value"
    )
</template>
<script lang="ts">
import { defineComponent, ref, shallowReactive } from 'vue'
export default defineComponent({
  name: 'Select',
  props: {
    width: {
      type: String || Number,
      default: '100%'
    },
    clearable: {
      type: Boolean,
      default: true
    }
  },
  setup(props, context) {
    const attrs = context.attrs
    const value = ref('mic-pc-home')
    const optionSource = shallowReactive([
      {
        value: 'mic-pc-home',
        label: 'mic-pc-home',
        path: '/mic-pc-home/about/home'
      },
      {
        value: 'mic-pc-dispatch',
        label: 'mic-pc-dispatch',
        path: '/mic-pc-dispatch/about'
      },
      {
        value: 'mic-react',
        label: 'mic-react',
        path: '/mic-react/#/about'
      }
    ])
    return {
      attrs,
      value,
      optionSource
    }
  }
})
</script>
<style lang="stylus" scoped>
.c-select
  height 100%
  display flex
  align-items center
  justify-content center
</style>
