<template lang="pug">
.page-wrap
  .test-select
    span {{ '我是主应用内容' }}
</template>

<script lang="ts">
import { defineComponent } from 'vue'
export default defineComponent({
  name: 'Test',
  props: {
    width: {
      type: String || Number,
      default: '100%'
    }
  },
  setup(props, context) {
    return {}
  }
})
</script>

<style lang="stylus" scoped>
.test-select
  display flex
  align-items center
  justify-content center
  .page-wrap
    width 50%
</style>
