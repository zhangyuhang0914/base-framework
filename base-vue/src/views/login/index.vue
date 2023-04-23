<template lang="pug">
.login-wrap
  span 123
  el-button(type="primary") {{ primary }}
</template>

<script>
import { defineComponent, ref } from 'vue'
export default defineComponent({
  name: 'login',
  setup(props, { emit }) {
    const primary = ref('登录')
    return {
      primary
    }
  }
})
</script>

<style lang="stylus" scoped>
@import './index.styl'
</style>
