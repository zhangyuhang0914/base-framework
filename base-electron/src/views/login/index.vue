<template lang="pug">
.login-wrap
  span {{ msg }}
</template>

<script>
export default {
  name: 'Login',
  setup() {
    const msg = '我是登录'
    return {
      msg
    }
  }
}
</script>

<style lang="stylus" scoped>
@import './index.styl'
</style>
