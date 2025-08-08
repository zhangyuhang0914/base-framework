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
              <a-form-item label="主题模式">
                <a-select 
                  v-model:value="appStore.theme" 
                  @change="appStore.setTheme"
                >
                  <a-select-option value="light">浅色</a-select-option>
                  <a-select-option value="dark">深色</a-select-option>
                  <a-select-option value="auto">自动</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :span="8">
              <a-form-item label="语言设置">
                <a-select 
                  v-model:value="appStore.language" 
                  @change="appStore.setLanguage"
                >
                  <a-select-option value="zh">中文</a-select-option>
                  <a-select-option value="en">English</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :span="8">
              <a-form-item label="侧边栏">
                <a-switch 
                  v-model:checked="sidebarExpanded"
                  @change="handleSidebarToggle"
                  checked-children="展开"
                  un-checked-children="收起"
                />
              </a-form-item>
            </a-col>
          </a-row>
        </a-form>
        
        <a-descriptions :column="2" bordered class="mt-4">
          <a-descriptions-item label="设备类型">
            <a-tag :color="getDeviceColor(appStore.deviceType)">
              {{ getDeviceText(appStore.deviceType) }}
            </a-tag>
          </a-descriptions-item>
          <a-descriptions-item label="当前主题">
            <a-tag :color="appStore.isDarkMode ? 'purple' : 'orange'">
              {{ appStore.isDarkMode ? '深色模式' : '浅色模式' }}
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
import { useAppStore } from '@/store/modules/app'
import type { DeviceType } from '@/store/interface'

// 使用 store
const userStore = useUserStore()
const appStore = useAppStore()

// 注入全局方法
const $message = inject('$message') as any
const $notification = inject('$notification') as any
const $confirm = inject('$confirm') as any

// 响应式数据
const loginLoading = ref(false)

// 计算属性
const sidebarExpanded = computed({
  get: () => !appStore.sidebarCollapsed,
  set: (value: boolean) => appStore.setSidebarCollapsed(!value)
})

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

const handleSidebarToggle = (checked: boolean) => {
  appStore.setSidebarCollapsed(!checked)
}

const getDeviceColor = (type: DeviceType) => {
  const colors: Record<DeviceType, string> = {
    desktop: 'green',
    tablet: 'orange',
    mobile: 'blue'
  }
  return colors[type] || 'default'
}

const getDeviceText = (type: DeviceType) => {
  const texts: Record<DeviceType, string> = {
    desktop: '桌面端',
    tablet: '平板',
    mobile: '移动端'
  }
  return texts[type] || type
}

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

// 初始化应用设置
appStore.initApp()
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