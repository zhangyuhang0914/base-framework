<template lang="pug">
el-dialog.camera-dialog(
  v-model="dialogVisibled"
  width="60%"
  append-to-body
  :show-close="false"
  @close="close")
  #scan-container.show-scan
  template(#footer)
    el-button(v-if="types.includes('photo')" type="primary" @click="takePhoto") {{ '拍照' }}
    el-button(type="primary" @click="close") {{ '返回' }}
</template>

<script>
import { userCommonStoreHook } from '@/stores/modules/common'
import { onMounted, computed, nextTick, onUnmounted } from 'vue'
import { $message } from '@/plugins/element'
export default {
  name: 'CameraDialog',
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    types: {
      type: Array,
      default: () => {
        return ['scan']
      }
    }
  },
  emits: ['close', 'jsqrCallback', 'photoCallback'],
  setup(props, { emit }) {
    const commonHook = userCommonStoreHook()
    // 实例化摄像头
    const cameraInstance = commonHook.getCameraInstance({
      width: '100%',
      height: '100%',
      types: props.types,
      containerId: 'scan-container',
      jsqrCallback: data => {
        emit('jsqrCallback', data)
        $message('扫描成功', 'success')
        closeCamera()
      },
      photoCallback: data => {
        emit('photoCallback', data)
        $message('拍照成功', 'success')
      }
    })
    // 拍照
    const takePhoto = () => {
      cameraInstance.setTakePhoto()
    }
    // 关闭弹窗
    const close = () => {
      emit('close')
      closeCamera()
    }
    // 关闭播放
    const closeCamera = () => {
      nextTick(() => {
        cameraInstance.closeCamera()
      })
    }
    // 弹窗
    const dialogVisibled = computed(() => {
      return props.visible
    })
    onMounted(() => {
      cameraInstance.openCamera()
    })
    onUnmounted(() => {
      cameraInstance.closeCamera()
    })
    return {
      cameraInstance,
      dialogVisibled,
      takePhoto,
      close
    }
  }
}
</script>

<style lang="stylus" scoped>
.show-scan
  background-image url('images/common/scan.gif')
  background-position center
  background-size 100% 108%
  background-repeat no-repeat
</style>
