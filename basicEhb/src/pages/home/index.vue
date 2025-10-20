<template lang="pug">
  .templatePage
    vanImage(width="100%" height="308" :src="getImage('home.headerBoolean')")
</template>

<script lang="ts">
import { countDisplay } from '@/api/helper/common'
import { getImage } from '@/constants/images'
import { defineComponent, onMounted } from 'vue'

export default defineComponent({
  name: 'Home',
  setup() {
    // 获取统计数据
    const getCountDisplay = () => {
      countDisplay().then(res => {
        console.log('getCountDisplay', res)
      })
    }
    onMounted(() => {
      // 调用鄂汇办SDK组件
      ehbAppJssdk.notice.showPreloader({
        text: '使劲加载中..'
      })
      setTimeout(() => {
        ehbAppJssdk.notice.hidePreloader()
      }, 3000)
      // 获取统计数据
      getCountDisplay()
    })
    return {
      getImage
    }
  }
})
</script>

<style lang="scss" scoped>
.home-container {
  padding: 20px;
}

h1 {
  margin-bottom: 30px;
  color: #1890ff;
}

demo-section {
  margin-bottom: 40px;
  padding: 20px;
  border: 1px solid #e8e8e8;
  border-radius: 4px;
  background-color: #fff;
}

demo-section h2 {
  margin-bottom: 16px;
  color: #262626;
  font-size: 18px;
  font-weight: 500;
}
</style>
