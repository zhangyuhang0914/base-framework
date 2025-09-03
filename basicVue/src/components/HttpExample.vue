<template>
  <div class="http-example">
    <a-card title="Alova.js HTTP 客户端示例" class="mb-4">
      <!-- 基础请求示例 -->
      <a-card type="inner" title="基础请求" class="mb-4">
        <a-space wrap>
          <a-button type="primary" @click="testGet" :loading="loading.get">GET 请求</a-button>
          <a-button @click="testPost" :loading="loading.post">POST 请求</a-button>
          <a-button @click="testPut" :loading="loading.put">PUT 请求</a-button>
          <a-button @click="testDelete" :loading="loading.delete" danger>DELETE 请求</a-button>
        </a-space>

        <a-divider />

        <div v-if="response" class="response-display">
          <h4>响应结果：</h4>
          <pre>{{ JSON.stringify(response, null, 2) }}</pre>
        </div>
      </a-card>

      <!-- 用户 API 示例 -->
      <a-card type="inner" title="用户 API 示例" class="mb-4">
        <a-row :gutter="16">
          <a-col :span="12">
            <a-form layout="vertical">
              <a-form-item label="用户名">
                <a-input v-model:value="loginForm.username" placeholder="请输入用户名" />
              </a-form-item>
              <a-form-item label="密码">
                <a-input-password v-model:value="loginForm.password" placeholder="请输入密码" />
              </a-form-item>
              <a-form-item>
                <a-space>
                  <a-button type="primary" @click="testLogin" :loading="loading.login">
                    模拟登录
                  </a-button>
                  <a-button @click="testGetUserInfo" :loading="loading.userInfo">
                    获取用户信息
                  </a-button>
                  <a-button @click="testLogout" :loading="loading.logout">退出登录</a-button>
                </a-space>
              </a-form-item>
            </a-form>
          </a-col>
          <a-col :span="12">
            <div v-if="userInfo" class="user-info">
              <h4>用户信息：</h4>
              <a-descriptions :column="1" bordered size="small">
                <a-descriptions-item label="用户名">
                  {{ userInfo.username }}
                </a-descriptions-item>
                <a-descriptions-item label="昵称">
                  {{ userInfo.nickname || '未设置' }}
                </a-descriptions-item>
                <a-descriptions-item label="邮箱">
                  {{ userInfo.email || '未设置' }}
                </a-descriptions-item>
                <a-descriptions-item label="角色">
                  <a-tag v-for="role in userInfo.roles" :key="role" color="blue">
                    {{ role }}
                  </a-tag>
                </a-descriptions-item>
              </a-descriptions>
            </div>
          </a-col>
        </a-row>
      </a-card>

      <!-- 高级功能示例 -->
      <a-card type="inner" title="高级功能" class="mb-4">
        <a-space wrap>
          <a-button @click="testBatch" :loading="loading.batch">批量请求</a-button>
          <a-button @click="testSerial" :loading="loading.serial">串行请求</a-button>
          <a-button @click="testRetry" :loading="loading.retry">重试请求</a-button>
          <a-button @click="testCache" :loading="loading.cache">缓存请求</a-button>
          <a-button @click="clearAllCache">清除缓存</a-button>
        </a-space>

        <a-divider />

        <!-- 文件上传示例 -->
        <a-upload
          :before-upload="handleUpload"
          :show-upload-list="false"
          accept=".jpg,.jpeg,.png,.gif"
        >
          <a-button :loading="loading.upload">
            <upload-outlined />
            文件上传
          </a-button>
        </a-upload>

        <a-button @click="testDownload" :loading="loading.download" class="ml-2">
          <download-outlined />
          文件下载
        </a-button>
      </a-card>

      <!-- 请求状态 -->
      <a-card type="inner" title="请求状态">
        <a-descriptions :column="2" bordered>
          <a-descriptions-item label="全局加载状态">
            <a-tag color="success">空闲</a-tag>
          </a-descriptions-item>
          <a-descriptions-item label="用户登录状态">
            <a-tag :color="userStore.isLoggedIn ? 'success' : 'default'">
              {{ userStore.isLoggedIn ? '已登录' : '未登录' }}
            </a-tag>
          </a-descriptions-item>
        </a-descriptions>
      </a-card>
    </a-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, inject } from 'vue'
import { UploadOutlined, DownloadOutlined } from '@ant-design/icons-vue'
import { useUserStore } from '@/store/modules/user'
import { userApi } from '@/api/helper'
import { get, post, batch, serial, retry, cached, clearCache } from '@/common/http'
import type { UserInfo, LoginParams } from '@/store/interface'
import type { UploadProps } from 'ant-design-vue'

// 使用 store
const userStore = useUserStore()
// const appStore = useAppStore() // 已移除 app store

// 注入全局方法
const $message = inject('$message') as any
const $notification = inject('$notification') as any

// 响应式数据
const response = ref<any>(null)
const userInfo = ref<UserInfo | null>(null)
const loginForm = reactive<LoginParams>({
  username: 'admin',
  password: '123456'
})

const loading = reactive({
  get: false,
  post: false,
  put: false,
  delete: false,
  login: false,
  userInfo: false,
  logout: false,
  batch: false,
  serial: false,
  retry: false,
  cache: false,
  upload: false,
  download: false
})

// 基础请求测试
const testGet = async () => {
  loading.get = true
  try {
    const result = await get('/test/get', { id: 1 })
    response.value = result
    $message.success('GET 请求成功')
  } catch (error) {
    console.error('GET 请求失败:', error)
  } finally {
    loading.get = false
  }
}

const testPost = async () => {
  loading.post = true
  try {
    const result = await post('/test/post', { name: 'test', type: 'demo' })
    response.value = result
    $message.success('POST 请求成功')
  } catch (error) {
    console.error('POST 请求失败:', error)
  } finally {
    loading.post = false
  }
}

const testPut = async () => {
  loading.put = true
  try {
    const result = await post('/test/put', { id: 1, name: 'updated' })
    response.value = result
    $message.success('PUT 请求成功')
  } catch (error) {
    console.error('PUT 请求失败:', error)
  } finally {
    loading.put = false
  }
}

const testDelete = async () => {
  loading.delete = true
  try {
    const result = await post('/test/delete')
    response.value = result
    $message.success('DELETE 请求成功')
  } catch (error) {
    console.error('DELETE 请求失败:', error)
  } finally {
    loading.delete = false
  }
}

// 用户 API 测试
const testLogin = async () => {
  loading.login = true
  try {
    const result = await userStore.login(loginForm)
    if (result.success) {
      userInfo.value = userStore.userInfo
      $message.success('登录成功')
    }
  } catch (error) {
    console.error('登录失败:', error)
  } finally {
    loading.login = false
  }
}

const testGetUserInfo = async () => {
  loading.userInfo = true
  try {
    const result = await userApi.getUserInfo()
  } catch (error) {
    console.error('获取用户信息失败:', error)
  } finally {
    loading.userInfo = false
  }
}

const testLogout = async () => {
  loading.logout = true
  try {
    await userStore.logout()
    userInfo.value = null
    $message.success('退出登录成功')
  } catch (error) {
    console.error('退出登录失败:', error)
  } finally {
    loading.logout = false
  }
}

// 高级功能测试
const testBatch = async () => {
  loading.batch = true
  try {
    const requests = [() => get('/test/1'), () => get('/test/2'), () => get('/test/3')]
    const results = await batch(requests)
    response.value = results
    $message.success('批量请求成功')
  } catch (error) {
    console.error('批量请求失败:', error)
  } finally {
    loading.batch = false
  }
}

const testSerial = async () => {
  loading.serial = true
  try {
    const requests = [
      () => get('/test/serial/1'),
      () => get('/test/serial/2'),
      () => get('/test/serial/3')
    ]
    const results = await serial(requests)
    response.value = results
    $message.success('串行请求成功')
  } catch (error) {
    console.error('串行请求失败:', error)
  } finally {
    loading.serial = false
  }
}

const testRetry = async () => {
  loading.retry = true
  try {
    const result = await retry(() => get('/test/retry'), 3, 1000)
    response.value = result
    $message.success('重试请求成功')
  } catch (error) {
    console.error('重试请求失败:', error)
  } finally {
    loading.retry = false
  }
}

const testCache = async () => {
  loading.cache = true
  try {
    const result = await cached('test-cache', () => get('/test/cache'), 60000)
    response.value = result
    $message.success('缓存请求成功')
  } catch (error) {
    console.error('缓存请求失败:', error)
  } finally {
    loading.cache = false
  }
}

const clearAllCache = () => {
  clearCache()
  $message.success('缓存已清除')
}

// 文件上传
const handleUpload: UploadProps['beforeUpload'] = async file => {
  loading.upload = true
  try {
    $message.success('文件上传成功')
  } catch (error) {
    console.error('文件上传失败:', error)
  } finally {
    loading.upload = false
  }
  return false // 阻止默认上传行为
}

// 文件下载
const testDownload = async () => {
  loading.download = true
  try {
    $message.success('文件下载成功')
  } catch (error) {
    console.error('文件下载失败:', error)
  } finally {
    loading.download = false
  }
}
</script>

<style scoped>
.http-example {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.mb-4 {
  margin-bottom: 16px;
}

.ml-2 {
  margin-left: 8px;
}

.response-display {
  background: #f5f5f5;
  padding: 16px;
  border-radius: 6px;
  margin-top: 16px;
}

.response-display pre {
  margin: 0;
  white-space: pre-wrap;
  word-break: break-all;
}

.user-info {
  background: #f9f9f9;
  padding: 16px;
  border-radius: 6px;
}
</style>
