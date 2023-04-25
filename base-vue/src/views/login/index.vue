<template lang="pug">
.login-wrap
  el-button(type="primary" @click="loginFn") {{ primary }}
</template>

<script>
import { defineComponent, ref } from 'vue'
import { login } from '@/apis/login'
export default defineComponent({
  name: 'login',
  setup(props, { emit }) {
    const primary = ref('登录')
    const loginFn = () => {
      let params = {
        a: 1
      }
      login(params)
        .then(result => {
          console.log('result', result)
        })
        .catch(err => {
          console.log('err', err)
        })
    }
    return {
      primary,
      loginFn
    }
  }
})
</script>

<style lang="stylus" scoped>
@import './index.styl'
</style>
