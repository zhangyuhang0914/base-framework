<template lang="pug">
  .home-container
    h1 演示组件集合
    .demo-section
      h2 HelloWorld 组件
    vanButton(type="primary" @click="toOtherPage") 跳转其他页面
</template>

<script setup lang="ts">
import { countDisplay } from '@/api/helper/common'
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
// 获取统计数据
const getCountDisplay = () => {
  countDisplay().then(res => {
    console.log('getCountDisplay', res)
  })
}
// 跳转其他页面
const toOtherPage = () => {
  router.push('/dispatch')
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
