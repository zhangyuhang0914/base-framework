<template lang="pug">
.page-wrap
  .operation-btn
    el-button(type="primary" @click="startCheck") {{ '网站检测' }}
    el-button(type="primary" @click="closeCheck") {{ '关闭检测' }}
    el-icon(@click="settingClick")
      Tools
  span {{ `检测结果：${checkStatus}` }}
</template>
<script lang="ts">
import {
  defineComponent,
  ref,
  onMounted,
  computed,
  getCurrentInstance
} from 'vue'
import { Tools } from '@element-plus/icons-vue'

export default defineComponent({
  name: 'App',
  components: {
    Tools
  },
  setup() {
    const config =
      getCurrentInstance()?.appContext.config.globalProperties || {}
    const { $chrome } = config
    const status = ref(false)
    const checkStatus = computed(() => {
      return status.value ? '检测中' : '未开始检测'
    })
    const startCheck = () => {
      $chrome.storage.local.set({ checkStatus: true })
    }
    const closeCheck = () => {
      $chrome.storage.local.set({ checkStatus: false })
    }
    // 打开设置页面
    const settingClick = () => {
      const optionsUrl = $chrome.runtime.getURL('options.html')
      $chrome.tabs.query({ url: optionsUrl }, (tabs: any) => {
        if (tabs.length) {
          $chrome.tabs.update(tabs[0].id, { active: true })
        } else {
          $chrome.tabs.create({ url: optionsUrl })
        }
      })
    }
    onMounted(() => {
      $chrome.storage.local.get('checkStatus').then((result: any) => {
        status.value = result.checkStatus || false
      })
      $chrome.storage.onChanged.addListener((changes: any, namespace: any) => {
        if (namespace === 'local') {
          for (const [key, value] of Object.entries(changes)) {
            if (key === 'checkStatus') {
              status.value = changes.checkStatus.newValue
            }
            console.log('onChanged', key, value, changes)
          }
        }
      })
    })
    return {
      status,
      checkStatus,
      startCheck,
      closeCheck,
      settingClick
    }
  }
})
</script>
<style lang="stylus" scoped>
.page-wrap
  width 300px
  height 200px
  display flex
  flex-direction column
  align-items center
  justify-content space-around
  .el-icon
    font-size large
    position absolute
    top 12px
    right 12px
    cursor pointer
</style>
