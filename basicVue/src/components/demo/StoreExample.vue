<template>
  <div class="store-example">
    <a-card title="Pinia 状态管理示例" class="mb-4">
      <!-- 用户信息展示 -->
      <a-card type="inner" title="用户状态" class="mb-4">
        <a-descriptions :column="1" bordered>
          <a-descriptions-item label="登录状态">
            <a-tag :color="userStore.isLoggedIn ? 'green' : 'red'">
              {{ userStore.isLoggedIn ? '已登录' : '未登录' }}
            </a-tag>
          </a-descriptions-item>
          <a-descriptions-item label="用户名">
            {{ userStore.userName }}
          </a-descriptions-item>
          <a-descriptions-item label="用户角色" v-if="userStore.isLoggedIn">
            <a-tag v-for="role in userStore.userRoles" :key="role" color="blue">
              {{ role }}
            </a-tag>
          </a-descriptions-item>
        </a-descriptions>
        
        <div class="mt-4">
          <a-space>
            <a-button 
              v-if="!userStore.isLoggedIn" 
              type="primary" 
              @click="handleLogin"
              :loading="loginLoading"
            >
              模拟登录
            </a-button>
            <a-button 
              v-else 
              @click="userStore.logout"
            >
              退出登录
            </a-button>
          </a-space>
        </div>
      </a-card>

      <!-- 应用设置 -->
      <a-card type="inner" title="应用设置">
        <a-form layout="vertical">
          <a-row :gutter="16">
            <a-col :span="8">
              <a-form-item label="算法主题">
                <a-select 
                  v-model:value="globalStore.algorithmTheme" 
                  @change="globalStore.setAlgorithmTheme"
                >
                  <a-select-option value="light">浅色</a-select-option>
                  <a-select-option value="dark">深色</a-select-option>
                  <a-select-option value="compact">紧凑</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :span="8">
              <a-form-item label="语言设置">
                <a-select 
                  v-model:value="globalStore.language" 
                  @change="globalStore.setLanguage"
                >
                  <a-select-option value="zh">中文</a-select-option>
                  <a-select-option value="en">English</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <!-- 侧边栏功能已移除 -->
          </a-row>
        </a-form>
        
        <a-descriptions :column="2" bordered class="mt-4">
          <a-descriptions-item label="当前语言">
            <a-tag color="blue">
              {{ globalStore.language === 'zh' ? '中文' : 'English' }}
            </a-tag>
          </a-descriptions-item>
          <a-descriptions-item label="算法主题">
            <a-tag :color="globalStore.algorithmTheme === 'dark' ? 'purple' : globalStore.algorithmTheme === 'compact' ? 'orange' : 'green'">
              {{ globalStore.algorithmTheme === 'dark' ? '深色' : globalStore.algorithmTheme === 'compact' ? '紧凑' : '浅色' }}
            </a-tag>
          </a-descriptions-item>
        </a-descriptions>
      </a-card>

      <!-- 全局方法测试 -->
      <a-card type="inner" title="全局方法测试" class="mt-4">
        <a-space wrap>
          <a-button @click="testMessage('success')" type="primary">
            成功消息
          </a-button>
          <a-button @click="testMessage('error')" danger>
            错误消息
          </a-button>
          <a-button @click="testMessage('warning')">
            警告消息
          </a-button>
          <a-button @click="testNotification">
            通知
          </a-button>
          <a-button @click="testConfirm">
            确认框
          </a-button>
        </a-space>
      </a-card>
    </a-card>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, inject } from 'vue'
import { useUserStore } from '@/store/modules/user'
import { useGlobalStore } from '@/store/modules/global'
// import type { DeviceType } from '@/store/interface' // 已移除

// 使用 store
const userStore = useUserStore()
const globalStore = useGlobalStore()

// 注入全局方法
const $message = inject('$message') as any
const $notification = inject('$notification') as any
const $confirm = inject('$confirm') as any

// 响应式数据
const loginLoading = ref(false)

// 计算属性已移除侧边栏相关功能

// 方法
const handleLogin = async () => {
  loginLoading.value = true
  try {
    const result = await userStore.login({
      username: 'admin',
      password: '123456'
    })
    
    if (result.success) {
      $message.success('登录成功！')
    } else {
      $message.error(result.message)
    }
  } finally {
    loginLoading.value = false
  }
}

// 侧边栏切换功能已移除

// 设备类型相关函数已移除

const testMessage = (type: 'success' | 'error' | 'warning') => {
  const messages = {
    success: '操作成功！',
    error: '操作失败！',
    warning: '请注意！'
  }
  $message[type](messages[type])
}

const testNotification = () => {
  $notification.info({
    message: '通知标题',
    description: '这是一条通知消息，用于展示重要信息。',
    duration: 4.5
  })
}

const testConfirm = () => {
  $confirm({
    title: '确认操作',
    content: '您确定要执行此操作吗？此操作不可撤销。',
    onOk() {
      $message.success('操作已确认')
    },
    onCancel() {
      $message.info('操作已取消')
    }
  })
}

// 应用初始化已移除
</script>

<style scoped>
.store-example {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.mb-4 {
  margin-bottom: 16px;
}

.mt-4 {
  margin-top: 16px;
}
</style>