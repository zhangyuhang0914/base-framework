<!--电子签名组件-->
<script setup>
import vueEsign from 'vue-esign'
import { $message } from '../plugins/element'
const emit = defineEmits(['handleGenerate'])
let vueEsignCanvas = ref(null)
let esignRef = ref(null)
let esignOptions = ref({
  width: 0,
  height: 0
})
const props = defineProps({
  // 画笔粗细
  lineWidth: {
    type: Number,
    default: 4
  },
  // 画笔颜色
  lineColor: {
    type: String,
    default: '#000000'
  },
  // 画布背景色，为空时画布背景透明，支持多种格式 '#ccc'，'#E5A1A1'，'rgb(229, 161, 161)'，'rgba(0,0,0,.6)'，'red'
  bgColor: {
    type: String,
    default: '#ffffff'
  },
  // 是否裁剪，在画布设定尺寸基础上裁掉四周空白部分
  isCrop: {
    type: Boolean,
    default: false
  },
  // 清空画布时(reset)是否同时清空设置的背景色(bgColor)
  isClearBgColor: {
    type: Boolean,
    default: true
  },
  // 生成图片格式 image/jpeg(jpg格式下生成的图片透明背景会变黑色请慎用或指定背景色)、 image/webp
  format: {
    type: String,
    default: 'image/png'
  },
  // 生成图片质量；在指定图片格式为 image/jpeg 或 image/webp的情况下，可以从 0 到 1 的区间内选择图片的质量。如果超出取值范围，将会使用默认值 0.92。其他参数会被忽略。
  quality: {
    type: Number,
    default: 1
  }
})
let bgColorVal = computed(() => {
  return props.bgColor
})
// 确定
const handleGenerate = () => {
  esignRef.value.generate().then(res => {
    emit('handleGenerate', res)
  }).catch(err => {
    console.log(err)
    $message(err, 'info')
  })
}
// 清空画板
const handleReset = () => {
  esignRef.value && esignRef.value.reset()
}
const init = () => {
  handleReset()
  // 根据父盒子设置canvas宽、高
  esignOptions.value.width = vueEsignCanvas.value.clientWidth
  esignOptions.value.height = vueEsignCanvas.value.clientHeight
}
onMounted(() => {
  init()
})
defineExpose({ init })
</script>
<template>
  <div class='vueEsignMain'>
    <div class='vueEsignCanvas' ref='vueEsignCanvas'>
      <vue-esign
        v-if='esignOptions.width'
        ref="esignRef"
        :width="esignOptions.width"
        :height="esignOptions.height"
        :lineWidth="lineWidth"
        :lineColor="lineColor"
        v-model:bgColor="bgColorVal"
        :isCrop="isCrop"
        :isClearBgColor='isClearBgColor'
        :format='format'
        :quality='quality'
      />
    </div>
    <div class='vueEsignBtn'>
      <el-button type='primary' @click="handleReset">清空画板</el-button>
      <el-button type='primary' @click="handleGenerate">确定</el-button>
    </div>
  </div>
</template>
<style scoped lang='stylus'>
.vueEsignMain
  height 100%
  width 100%
  .vueEsignCanvas
    border-radius: 10px;
    background: transparent;
    border 1px solid #cccccc
    box-sizing border-box
    height calc(100% - 60px)
    :deep(canvas)
      border-radius: 10px;
  .vueEsignBtn
    padding-top 20px
    text-align center
</style>
