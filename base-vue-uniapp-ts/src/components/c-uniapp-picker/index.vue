<template lang="pug">
.c-column-select
  picker(@change="bindPickerChange" :value="pIndex" :range="range")
    u-input(v-model="range[pIndex]" border="none" readonly :placeholder="placeholder")
      template(#suffix)
        slot(name="right")
          span.suffix-right {{ '选择' }}
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
const props = defineProps({
  placeholder: {
    type: String,
    default: ''
  },
  columns: {
    type: Array,
    default: () => []
  },
  keyName: {
    type: String,
    default: 'name'
  },
  defaultName: {
    type: String,
    default: ''
  }
})
const $emit = defineEmits(['confirm'])
let range = computed(() => {
  return props.columns.map((item: any) => {
    if (item && item[props.keyName]) {
      return item[props.keyName]
    }
  })
})
let pIndex = ref()
const getPIndex = (value: string) => {
  let index = props.columns.findIndex(item => item[props.keyName] === value)
  return index === -1 ? '' : index
}
const bindPickerChange = (e: AnyObject) => {
  pIndex.value = e.detail.value
  $emit('confirm', props.columns[pIndex.value])
}
watch(
  () => props.defaultName,
  val => {
    if (val) {
      pIndex.value = getPIndex(val)
    }
  },
  {
    immediate: true
  }
)
</script>

<style lang="stylus" scoped>
@import './index.styl'
</style>
