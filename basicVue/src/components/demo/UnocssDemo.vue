<template>
  <div class="unocss-demo">
    <h2 class="text-2xl font-bold mb-6 text-primary">UnoCSS 使用示例</h2>
    
    <!-- 基础样式示例 -->
    <div class="card mb-6">
      <h3 class="text-xl font-semibold mb-4">基础样式</h3>
      <div class="space-y-3">
        <div class="p-4 bg-primary text-white rounded-md">
          <p>bg-primary text-white p-4 rounded-md</p>
        </div>
        <div class="p-4 bg-secondary text-white rounded-md">
          <p>bg-secondary text-white p-4 rounded-md</p>
        </div>
        <div class="p-4 bg-warning text-white rounded-md">
          <p>bg-warning text-white p-4 rounded-md</p>
        </div>
      </div>
    </div>
    
    <!-- 布局示例 -->
    <div class="card mb-6">
      <h3 class="text-xl font-semibold mb-4">布局示例</h3>
      <div class="flex space-x-4 mb-4">
        <div class="flex-1 p-4 bg-gray-100 rounded-md">flex-1</div>
        <div class="flex-1 p-4 bg-gray-200 rounded-md">flex-1</div>
        <div class="flex-1 p-4 bg-gray-300 rounded-md">flex-1</div>
      </div>
      <div class="flex-center h-32 bg-gray-100 rounded-md">
        <p>flex-center h-32</p>
      </div>
    </div>
    
    <!-- 响应式示例 -->
    <div class="card mb-6">
      <h3 class="text-xl font-semibold mb-4">响应式示例</h3>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div class="p-4 bg-blue-100 rounded-md">响应式卡片 1</div>
        <div class="p-4 bg-green-100 rounded-md">响应式卡片 2</div>
        <div class="p-4 bg-yellow-100 rounded-md">响应式卡片 3</div>
      </div>
    </div>
    
    <!-- 自定义快捷方式示例 -->
    <div class="card mb-6">
      <h3 class="text-xl font-semibold mb-4">自定义快捷方式</h3>
      <div class="space-x-3">
        <button class="btn btn-primary">主按钮</button>
        <button class="btn btn-secondary">次要按钮</button>
        <button class="btn btn-danger">危险按钮</button>
      </div>
    </div>
    
    <!-- 属性化模式示例 -->
    <div class="card">
      <h3 class="text-xl font-semibold mb-4">属性化模式</h3>
      <div bg="gray-100" p="4" rounded="md">
        <p text="gray-800">使用属性化模式：bg="gray-100" p="4" rounded="md" text="gray-800"</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
</script>

<style scoped>
.unocss-demo {
  padding: 24px;
}
</style>
