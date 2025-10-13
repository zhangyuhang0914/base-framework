<template>
  <div class="container">
    <span class="text">404</span>
    <a-button type="primary" @click="handleBack">
      回到首页
    </a-button>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useRouter } from 'vue-router'

export default defineComponent({
  name: 'NotFoundPage',
  setup() {
    // 获取路由实例
    const router = useRouter()
    // 处理返回首页逻辑
    const handleBack = () => {
      router.push({
        path: '/'
      })
    }
    return {
      handleBack
    }
  }
})
</script>

<style lang="scss" scoped>
.container {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 100%;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  color: #999;
  .text {
    padding: 0 0 40px 0;
    font-size: 160px;
    color: #1890ff;
  }
}
</style>
