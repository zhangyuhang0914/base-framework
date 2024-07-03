<template lang="pug">
.task-wrap
  .task-list
    span(@click="handleClick") {{ myText }}
</template>

<script>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
export default {
  name: 'taskList',
  setup() {
    const myText = ref('我是任务列表')
    const router = useRouter()
    const handleClick = () => {
      router.push({
        name: 'report'
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
