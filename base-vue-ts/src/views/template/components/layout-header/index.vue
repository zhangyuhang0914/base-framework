<template lang="pug">
.layout-header
  .logo-title {{ '湖北北斗供应链天网平台' }}
  .menus-content
    .menus-item(v-for="(item, index) in menus" :key="index") {{ item.name }}
  .login-wrap
    el-button(type="primary") {{ '企业登录' }}
</template>

<script lang="ts">
import { defineComponent, reactive } from 'vue'
interface MenusType {
  name: string
  url: string
}
export default defineComponent({
  name: 'LayoutHeader',
  setup(props) {
    const menus: MenusType[] = reactive([
      {
        name: '首页',
        url: '/platform/index'
      },
      {
        name: '北斗资讯',
        url: '/platform/news'
      },
      {
        name: '产品需求',
        url: '/platform/demand'
      },
      {
        name: '供给市场',
        url: '/platform/market'
      },
      {
        name: '公共服务',
        url: '/platform/service'
      },
      {
        name: '供需活动',
        url: '/platform/activity'
      },
      {
        name: '区域专区',
        url: '/platform/area'
      }
    ])
    return {
      menus
    }
  }
})
</script>

<style lang="stylus" scoped>
@import './index.styl'
</style>
