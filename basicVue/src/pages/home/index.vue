<template>
  <div class="home-container">
    <h1>演示组件集合</h1>
    <div class="demo-section">
      <h2>HelloWorld 组件</h2>
      <HelloWorld msg="欢迎使用Vue 3组件" />
    </div>
    <div class="demo-section">
      <h2>UnocssDemo 组件</h2>
      <UnocssDemo />
    </div>
  </div>
</template>

<script setup lang="ts">
import HelloWorld from '@/components/demo/HelloWorld.vue'
import UnocssDemo from '@/components/demo/UnocssDemo.vue'
</script>

<style scoped>
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
