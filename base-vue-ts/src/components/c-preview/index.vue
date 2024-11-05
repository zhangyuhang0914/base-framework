<template lang="pug">
.c-preview
  ElImage(v-if="['img', 'previewImg'].includes(type)" :src="src" alt="" @click="previewHandle")
    template(#error)
      ElIcon
        Picture
  .preview-image(v-if="type === 'previewImg'")
    Teleport(to="body")
      ElImageViewer(
        v-if="type === 'previewImg' && previewImgVisible"
        :urlList="imgUrls"
        :zIndex='2000'
        :initialIndex="startIndex"
        :infinite="true"
        :hideOnClickModal="true"
        @close="previewImgVisible = false"
      )
  .preview-other(v-if="['video', 'audio'].includes(type)")
    Teleport(to="body")
      //- ElDialog(
      //-   custom-class="video-dialog"
      //-   v-if="type === 'video'"
      //-   v-model="visible"
      //-   destroy-on-close
      //-   :showClose='false'
      //-   draggable
      //-   @close="close"
      //- )
      //-   i.iconfont.icon-guanbi.close(@click="close")
      //-   videoPlay(ref="videoRef" v-bind="options" v-if="options.src")
      //- 播放音频
      audio(
        v-if="type === 'audio' && firstUrl"
        :src="firstUrl"
        autoplay
        @ended="endAudio"
      )
</template>
<script lang="ts">
import { defineComponent, reactive, ref, watch } from 'vue'
import { Picture } from '@element-plus/icons-vue'
import { ElImageViewer, ElDialog } from 'element-plus'
import { getDomFontSize } from '@/utils/utils'
export default defineComponent({
  name: 'Preview',
  components: { ElImageViewer, ElDialog },
  props: {
    type: {
      type: String,
      default: 'img'
    },
    src: {
      type: String,
      default: ''
    },
    urls: {
      type: Array,
      default: () => []
    },
    startIndex: {
      type: Number,
      default: 0
    }
  },
  emits: ['close'],
  setup(props, { emit }) {
    const previewImgVisible = ref(false)
    const imgUrls: any = props.urls
    const visible = ref(true)
    const firstUrl: any = ref(props.urls[0])
    const close = () => {
      emit('close')
    }
    watch(
      () => props.urls,
      (val: any) => {
        firstUrl.value = val[0]
      }
    )
    const videoRef = ref()
    const options = reactive({
      src: props.urls[0],
      control: true, //是否显示控制
      width: getDomFontSize(400, 'rem'), //播放器高度
      height: getDomFontSize(450, 'rem'), //播放器高度
      autoPlay: false,
      muted: false,
      volume: 1,
      controlBtns: ['audioTrack', 'quality', 'speedRate', 'volume', 'setting', 'pip', 'pageFullScreen', 'fullScreen']
    })
    const previewHandle = () => {
      if (['img', 'previewImg'].includes(props.type)) {
        previewImgVisible.value = true
      }
    }
    setTimeout(() => {
      if (props.type === 'video') {
        videoRef.value?.play()
      }
    }, 500)

    const endAudio = () => {
      console.log('close')
      emit('close')
    }
    return {
      Picture,
      previewImgVisible,
      videoRef,
      imgUrls,
      close,
      visible,
      options,
      firstUrl,
      previewHandle,
      endAudio
    }
  }
})
</script>
<style lang="stylus">
.c-preview
  height 100%
  display flex
  align-items center
  justify-content center
.video-dialog
  .el-dialog__header
    display: none
  .el-dialog__body
    padding: 0
    position: relative
    .d-player-wrap
      width auto
    i.close
      cursor pointer
      color $white
      font-size: 20px
      position absolute
      right: -20px
      top: -20px
      width: 40px;
      height: 40px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 100
      background: rgba(0,0,0,0.8)
</style>
