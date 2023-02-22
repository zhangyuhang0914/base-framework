<script setup>
import { onLaunch } from '@dcloudio/uni-app'
import { getCurrentInstance, onMounted } from 'vue'
onLaunch(() => {
  const { appContext, proxy } = getCurrentInstance() // 3.0.11
  const global = appContext.config.globalProperties
  uni.getSystemInfo({
    success: (e) => {
      console.log('getSystemInfo', e)
      // #ifndef MP
      global.statusBar = e.statusBarHeight
      if (e.platform === 'android') {
        global.customBarHeight = e.statusBarHeight + 50
      } else {
        global.customBarHeight = e.statusBarHeight + 45
      }
      // #endif

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
// 引入uview-plus主题
@import 'uview-plus/theme.scss';
// uview-plus
@import 'uview-plus/index.scss';
/*每个页面公共css */
@import '@/assets/uni.scss';
</style>

<style>
page {
  height: 100%;
	display: flex;
	font-size: 28rpx;
}
</style>
