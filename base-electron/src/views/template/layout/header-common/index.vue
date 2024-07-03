<template lang="pug">
.header-box-wrap
  .header-left
    span {{ systemInfo.name }}
  .header-right
    .operation-group
      el-button(type="primary" @click="handleHome") {{ '主页' }}
      el-input.search(
        v-model="searchValue"
        class="w-50 m-2"
        placeholder="搜索"
        @change="changeSearch"
        @keyup.enter
      )
        template(#prefix)
          el-icon
            Search
      el-button(type="primary" @click="handleLogin") {{ '登录' }}
</template>

<script>
import { ref, getCurrentInstance } from 'vue'
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
    // 路由
    const router = useRouter()
    // 主页
    const handleHome = () => {
      router.push({
        name: 'homePage'
      })
    }
    // 搜索
    const searchValue = ref('')
    const changeSearch = value => {
      console.log('changeSearch', value)
    }
    // 登录
    const handleLogin = () => {
      router.push({
        name: 'login'
      })
    }
    return {
      systemInfo,
      searchValue,
      handleHome,
      changeSearch,
      handleLogin
    }
  }
}
</script>

<style lang="stylus" scoped>
@import './index.styl'
</style>
