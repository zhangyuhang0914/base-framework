<template lang="pug">
.layout-footer
  span {{ '底部内容开发' }}
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
