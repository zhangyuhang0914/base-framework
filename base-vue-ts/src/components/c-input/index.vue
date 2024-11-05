<template lang="pug">
  .c-input-wrap
    component(ref="inputRef" :is="h(ElInput, $attrs, $slots)" v-model="model")
  </template>

<script setup lang="ts" name="CInput">
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { ElInput } from 'element-plus'
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { defineComponent, h, ref, defineModel } from 'vue'

const inputRef = ref()
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const model = defineModel()
defineExpose(
  new Proxy(
    {},
    {
      get(_target, prop) {
        return inputRef.value?.[prop]
      },
      has(_target, prop) {
        return prop in inputRef.value
      }
    }
  )
)
</script>
