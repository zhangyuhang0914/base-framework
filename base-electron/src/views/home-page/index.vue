<template lang="pug">
.home-page-wrap
  span(@click="handleClick") {{ msg }}
  img(:src="captchaImgUrl" @click="getCaptcha")
  el-input(v-model="toolParameter.latheNumber" @focus="onInputFocus('latheNumber')")
  el-input(v-model="toolParameter.tid" @focus="onInputFocus('tid')" placeholder="")
  .showKeyboard(v-if="showKeyboard")
    SimpleKeyboard(ref="SimpleKeyboardRef" @onChange="onChangeKeyboard" @parentMethods="parentMethods")
</template>

<script>
import { onMounted, shallowReactive, ref, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { imageCaptcha } from '@/apis/common'
import SimpleKeyboard from '@/components/simple-keyboard/index.vue'
export default {
  name: 'HomePage',
  components: { SimpleKeyboard },
  setup() {
    const router = useRouter()
    const msg = '我是首页'
    const handleClick = () => {
      router.push({
        name: 'Test'
      })
    }
    // 获取验证码
    const captchaImgUrl = ref('')
    const getCaptcha = () => {
      captchaImgUrl.value = imageCaptcha(Date.now())
    }
    // 键盘
    const toolParameter = shallowReactive({
      latheNumber: '',
      tid: ''
    })
    // 键盘默认隐藏
    const showKeyboard= ref(false)
    // 选择输入框
    const changeIpt = ref('')
    const SimpleKeyboardRef = ref(null)
    // 输入框聚焦事件
    const onInputFocus = val => {
      showKeyboard.value = true
      changeIpt.value = val
      // 父组件调用子组件的方法
      nextTick(() => {
        SimpleKeyboardRef.value.onKeysPress('{clear}')
      })
    }
    // 键盘按下事件
    const onChangeKeyboard = input => {
      if (changeIpt.value == 'latheNumber') {
        toolParameter.latheNumber = input
      } else if (changeIpt.value == 'tid') {
        toolParameter.tid = input
      }
    }
    // 调用父组件方法
    const parentMethods = (funcName) => {
      if (funcName === 'closekeyboard') {
        closekeyboard()
      }
    }
    // 点击关闭隐藏键盘
    const closekeyboard = () => {
      showKeyboard.value = false
    }
    onMounted(() => {
      getCaptcha()
    })
    return {
      msg,
      captchaImgUrl,
      toolParameter,
      showKeyboard,
      SimpleKeyboardRef,
      getCaptcha,
      handleClick,
      onInputFocus,
      onChangeKeyboard,
      parentMethods
    }
  }
}
</script>

<style lang="stylus" scoped>
@import './index.styl'
</style>
