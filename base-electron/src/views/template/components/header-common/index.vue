<template lang="pug">
.header-box-wrap
  .header-left
    img(:src="`${BASE_URL}images/common/header-title.png`" alt="")
  .header-right
    .current-time {{ currentTime }}
    .operation-group
      el-button.home(type="primary" @click="handleHome")
        img(:src="`${BASE_URL}images/common/header-home.png`")
        span {{ '主页' }}
      el-button.search(type="primary" @click="handleSearch") {{ '搜索' }}
      el-button.login(type="primary" @click="handleLogin") {{ '登录' }}
</template>

<script>
import { ref, getCurrentInstance, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { Search } from '@element-plus/icons-vue'
export default {
  name: 'HeaderCommon',
  components: { Search },
  setup() {
    // 当前组件实例
    const instance = getCurrentInstance()
    const config = instance.appContext.config.globalProperties
    const systemInfo = config.$config['systemInfo']
    const BASE_URL = import.meta.env.BASE_URL
    // 路由
    const router = useRouter()
    // 实时时间
    const currentTime = ref('')
    const getCurrentTime = () => {
      const currentTime = new Date()
      // 获取年、月、日、小时、分钟和秒
      const year = currentTime.getFullYear()
      const month = currentTime.getMonth()
      const day = currentTime.getDate()
      const hours = currentTime.getHours()
      const minutes = currentTime.getMinutes()
      // 获取星期
      const dayOfWeek = [
        '星期日',
        '星期一',
        '星期二',
        '星期三',
        '星期四',
        '星期五',
        '星期六'
      ]
      const dayWeek = dayOfWeek[currentTime.getDay()]
      // 格式化时间信息
      const formatterTime = `${year}年${month}月${month}日${day} ${hours
        .toString()
        .padStart(2, '0')}:${minutes.toString().padStart(2, '0')} ${dayWeek}`
      return formatterTime
    }
    currentTime.value = getCurrentTime()
    // 主页
    const handleHome = () => {
      router.push({
        name: 'HomePage'
      })
    }
    // 搜索
    const handleSearch = () => {}
    // 登录
    const handleLogin = () => {
      router.push({
        name: 'Login'
      })
    }
    onMounted(() => {
      // 每秒更新一次时间信息
      setInterval(() => {
        currentTime.value = getCurrentTime()
      }, 1000)
    })
    return {
      BASE_URL,
      systemInfo,
      currentTime,
      handleHome,
      handleSearch,
      handleLogin
    }
  }
}
</script>

<style lang="stylus" scoped>
@import './index.styl'
</style>
