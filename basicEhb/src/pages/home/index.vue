<template lang="pug">
  .home-container
    h1 演示组件集合
    .demo-section
      h2 HelloWorld 组件
    vanButton(type="primary") 主要按钮
</template>

<script setup lang="ts">
import { countDisplay } from '@/api/helper/common'

ehbAppJssdk.notice.showPreloader({
    text: "使劲加载中.."
})
setTimeout(() => {
  ehbAppJssdk.notice.hidePreloader()
}, 3000)
countDisplay().then(res => {
  console.log(res)
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
