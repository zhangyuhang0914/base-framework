<template lang="pug">
.page-wrap
  span {{ '内容首页' }}
</template>

<script lang="ts">
import { defineComponent, onMounted } from 'vue'
export default defineComponent({
  name: 'Home',
  setup(props, context) {
    onMounted(() => {
      console.log('onMounted')
    })
    return {}
  }
})
</script>

<style lang="stylus" scoped>
@import './index.styl'
</style>
