<template lang="pug">
.report-wrap
  .report-list
    span(@click="handleClick") {{ myText }}
</template>

<script>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
export default {
  name: 'reportList',
  setup() {
    const myText = ref('我是报告列表')
    const router = useRouter()
    const handleClick = () => {
      router.push({
        name: 'task'
      })
    }
    return {
      myText,
      handleClick
    }
  }
}
</script>

<style lang="stylus" scoped>
@import './index.styl'
</style>
