<template lang="pug">
.step-bar-wrap
  vanTabs(
    v-model:active="activeTab"
    color="#F6D687"
    title-active-color="#F6D687"
    title-inactive-color="#FFFFFF"
    background="#0F264F"
    swipe-threshold="3"
    @click-tab="onClickTab"
    @change="onChange"
  )
    vanTab(
      v-for="(tab, index) in tabData"
      :key="index"
      :name="tab.type"
      :title="tab.text"
      :disabled="tab.disabled"
    )
      slot(name="tab-content")
</template>

<script lang="ts">
import { computed, defineComponent, type PropType } from 'vue'
import type { TabsItem } from '../type'

export default defineComponent({
  name: 'TabsBar',
  props: {
    modelValue: {
      type: String,
      default: 'base_info'
    },
    tabData: {
      type: Array as PropType<TabsItem[]>,
      default: () => []
    }
  },
  emits: ['update:modelValue', 'onClickTab', 'onChange'],
  setup(props, { emit }) {
    // 点击标签时触发
    const onClickTab = (name: string | number, title: string, event: MouseEvent, disabled: boolean) => {
      emit('onClickTab', name)
    }
    // 当前激活的标签改变时触发
    const onChange = (name: string | number, title: string) => {
      emit('onChange', name)
      emit('update:modelValue', name)
    }
    const activeTab = computed(() => {
      return props.modelValue
    })
    return {
      activeTab,
      onClickTab,
      onChange
    }
  }
})
</script>

<style lang="stylus" scoped></style>
