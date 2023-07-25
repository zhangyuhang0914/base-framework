<template lang="pug">
.card-login-wrap
  .containerBox
    .title {{ '扫描身份证信息' }}
    .content
      #scanVideo
      .operation-box
        el-button(type="primary" @click="openCamera") {{ '重新扫描' }}
        el-button(type="primary" @click="closeCamera") {{ '扫描完成' }}
</template>
<script>
import { userCommonStoreHook } from '@/stores/modules/common'
import { onMounted, onUnmounted, ref } from 'vue'
export default {
  name: 'CardLogin',
  setup() {
    const commonHook = userCommonStoreHook()
    const videoWidth = ref(null)
    const videoHeight = ref(null)
    const cameraInstance = commonHook.getCameraInstance({
      width: '100%',
      height: '100%',
      containerId: 'scanVideo'
    })
    const openCamera = () => {
      cameraInstance.openCamera()
    }
    const closeCamera = () => {
      cameraInstance.closeCamera()
    }
    onMounted(() => {
      videoWidth.value = document.querySelector('.content').clientWidth / 2
      videoHeight.value = document.body.clientHeight / 2
      openCamera()
    })
    onUnmounted(() => {
      closeCamera()
    })
    return {
      videoWidth,
      videoHeight,
      openCamera,
      closeCamera
    }
  }
}
</script>
<style lang="stylus" scoped>
.card-login-wrap
  height 100%
  display flex
  align-items center
  overflow hidden
  & > .containerBox
    // height auto
    height: inherit
    & > .content
      display flex
      flex-direction column
      align-items center
      justify-content center
      #scanVideo
        width 400px
        height: 400px
      .operation-box
        display flex
        align-items center
        justify-content center
        padding-top 15px
</style>
