<template lang="pug">
.step-bar-wrap
  vanTabs(
    v-model:active="tabActive"
    color="#F6D687"
    title-active-color="#F6D687"
    title-inactive-color="#FFFFFF"
    background="#0F264F"
    swipe-threshold="3"
    @click-tab="onClickTab"
    @change="onChange"
  )
    vanTab(
      v-for="(tab, index) in data"
      :key="index"
      :name="tab.type"
      :title="tab.text"
      :disabled="tab.disabled"
    )
</template>

<script lang="ts">
import { defineComponent, type PropType } from 'vue'
import type { TabsItem } from '../type'

export default defineComponent({
  name: 'TabsBar',
  props: {
    data: {
      type: Array as PropType<TabsItem[]>,
      default: () => []
    },
    tabActive: {
      type: String,
      default: ''
    }
  },
  emits: ['onClickTab', 'onChange'],
  setup(props, { emit }) {
    // 点击标签时触发
    const onClickTab = (name: string | number, title: string, event: MouseEvent, disabled: boolean) => {
      emit('onClickTab', name)
    }
    // 当前激活的标签改变时触发
    const onChange = (name: string | number, title: string) => {
      emit('onChange', name)
    }
    return {
      onClickTab,
      onChange
    }
  }
})
</script>

<style lang="stylus" scoped></style>
