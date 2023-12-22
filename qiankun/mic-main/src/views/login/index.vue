<template lang="pug">
.page-wrap
  el-button(type="primary" @click="onLogin") {{ '登录' }}
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { setToken } from '@/utils/cookie'
import { useRouter } from 'vue-router'
export default defineComponent({
  name: 'Login',
  setup(props) {
    const router = useRouter()
    const onLogin = () => {
      setToken('123-456-789-012')
      router.push('/mic-pc-home/about/home')
    }
    return {
      onLogin
    }
  }
})
</script>

<style lang="stylus" scoped></style>
