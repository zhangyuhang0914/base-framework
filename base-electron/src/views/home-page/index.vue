<template lang="pug">
.home-page-wrap
  span(@click="handleClick") {{ msg }}
</template>

<script>
import { useRouter } from 'vue-router'
export default {
  name: 'HomePage',
  setup() {
    const router = useRouter()
    const msg = '我是首页'
    const handleClick = () => {
      router.push({
        name: 'Test'
      })
    }
    return {
      msg,
      handleClick
    }
  }
}
</script>

<style lang="stylus" scoped>
@import './index.styl'
</style>
