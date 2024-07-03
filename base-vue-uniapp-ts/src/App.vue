<script setup lang="ts">
import { onLaunch, onShow, onHide } from '@dcloudio/uni-app'
import { getCurrentInstance } from 'vue'
import Bus, { POLICYTYPE, REFRESH } from './common/bus'
onLaunch(() => {
  const appContext: any = getCurrentInstance()?.appContext
  const proxy: any = getCurrentInstance()?.proxy
  // const { appContext, proxy } = getCurrentInstance()
  const global = appContext.config.globalProperties
  console.log('App Launch', global)
  // 获取系统信息
  uni.getSystemInfo({
    success: (e: AnyObject) => {
      console.log('getSystemInfo', e)
      // #ifdef MP-WEIXIN
      let customMenuClient = uni.getMenuButtonBoundingClientRect()
      // 可操作菜单布局位置
      global.customMenuClient = customMenuClient
      // 自定义高度
      global.customBarHeight = customMenuClient.bottom + customMenuClient.top - e.statusBarHeight
      // 自定义状态栏高度
      global.statusBarHeight = e.statusBarHeight
      // 自定义头部高度
      global.headerBarHeight = customMenuClient.bottom + customMenuClient.top - e.statusBarHeight - e.statusBarHeight
      // 窗口可视高度
      global.windowHeight = e.windowHeight
      // #endif
    }
  })
})
onShow(() => {
  console.log('App Show')
})
onHide(() => {
  console.log('App Hide')
  Bus.$off(REFRESH)
  Bus.$off(POLICYTYPE)
})
</script>
<style lang="scss">
@import '/node_modules/uview-plus/index.scss';
// @import '../node_modules/uview-plus/index.scss';
@import './assets/font/iconfont.css';
</style>

<style lang="stylus">
@import './assets/css/app.styl'
</style>

<style>
page {
  height: 100%;
  margin: 0 auto;
  display: flex;
  font-size: 28rpx;
  line-height: 64rpx;
  letter-spacing: 3rpx;
  overflow: hidden;
}
</style>
