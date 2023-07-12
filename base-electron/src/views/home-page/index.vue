<template lang="pug">
.home-page-wrap
  span(@click="handleClick") {{ msg }}
  img(:src="captchaImgUrl" @click="getCaptcha")
</template>

<script>
import { onMounted, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { imageCaptcha } from '@/apis/common'
export default {
  name: 'HomePage',
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
    onMounted(() => {
      getCaptcha()
    })
    return {
      msg,
      captchaImgUrl,
      getCaptcha,
      handleClick
    }
  }
}
</script>

<style lang="stylus" scoped>
@import './index.styl'
</style>
