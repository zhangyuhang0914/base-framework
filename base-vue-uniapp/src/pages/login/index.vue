<template lang="pug">
.page-view
  customBar
  image.logo(src="/static/logo.png")
  .text-area
    text.title {{ title }}
    u-button(type="primary" text="确定")
</template>

<script>
import { defineComponent } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import customBar from '@/component/custom-bar'
export default defineComponent({
  components: { customBar },
  setup () {
    const title = 'Hello'
    onLoad(() => {

    })
    return {
      title
    }
  }
})
</script>

<style lang="scss">
// uview-plus
@import 'uview-plus/index.scss';
// 引入uview-plus主题
@import 'uview-plus/theme.scss';
</style>

<style lang="stylus" scoped>
@import '../../assets/css/import.styl'
</style>

<style>
.content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.logo {
  height: 200rpx;
  width: 200rpx;
  margin-top: 200rpx;
  margin-left: auto;
  margin-right: auto;
  margin-bottom: 50rpx;
}

.text-area {
  display: flex;
  justify-content: center;
}

.title {
  font-size: 36rpx;
  color: #8f8f94;
}
</style>
