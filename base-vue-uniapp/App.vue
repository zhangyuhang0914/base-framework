<script setup>
import { onLaunch } from '@dcloudio/uni-app'
import { getCurrentInstance, onMounted } from 'vue'
onLaunch(() => {
  const { appContext, proxy } = getCurrentInstance()
  const global = appContext.config.globalProperties
  uni.getSystemInfo({
    success: (e) => {
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
      global.headerBarHeight = (customMenuClient.bottom + customMenuClient.top - e.statusBarHeight) - e.statusBarHeight
      // #endif
    }
  })
})
onLoad(() => {
  // console.log('onLoad')
})
onShow(() => {
  // console.log('onShow')
})
onHide(() => {
  // console.log('onHide')
})
</script>

<style lang="scss" scope>
// uview-plus
@import 'uview-plus/index.scss';
// 引入uview-plus主题
@import 'uview-plus/theme.scss';
/*每个页面公共css */
@import '@/assets/uni.scss';
</style>

<style lang="stylus">
@import './assets/css/import.styl'
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
