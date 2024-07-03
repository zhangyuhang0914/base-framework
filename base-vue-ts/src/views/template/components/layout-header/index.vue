<template lang="pug">
.layout-header
  span 我是头部
</template>

<script lang="ts">
import { defineComponent } from 'vue'
export default defineComponent({
  name: 'LayoutHeader',
  setup(props) {
    return {}
  }
})
</script>

<style lang="stylus" scoped>
@import './index.styl'
</style>
