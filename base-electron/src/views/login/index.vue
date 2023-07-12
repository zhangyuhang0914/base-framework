<template lang="pug">
.login-wrap
  el-form(ref="formRef" :model="form" :rules="rules" size="large" label-width="120px")
    el-form-item(prop="username" label="用户名")
      el-input(v-model="form.username" @blur="checkIsBindUKey")
    el-form-item(prop="password" label="密码")
      el-input(v-model="form.password" type="password")
    el-form-item(prop="captcha" label="验证码")
      el-input(v-model="form.captcha")
        template(#append)
          img(:src="captchaImgUrl" @click="getCaptcha")
    el-form-item
      el-button(type="primary" @click="loginFn") {{ '登录' }}
</template>

<script>
import { onMounted, reactive } from 'vue'
import { imageCaptcha } from '@/apis/common'
import { login, initConfig, isUserBindUKey } from '@/apis/login'
// import { loadCaCert, caSignData } from '@/utils/gm/gmBjCaSecurity'
import myEncrypt from '@/utils/my-encrypt.js'
import { useRouter } from 'vue-router'
import { $message } from '@/plugins/element'
export default {
  name: 'Login',
  setup() {
    const router = useRouter()
    // 登录
    const gm = ref({
      serverRandom: '',
      gmJson: '',
      gmEnable: '',
      pwdType: ''
    })
    const captchaImgUrl = ref('')
    const formRef = ref(null)
    const form = reactive({
      username: 'admin',
      password: '123-!@#',
      captcha: '',
      captchaId: ''
    })
    const rules = reactive({
      username: [
        { required: true, message: '请输入用户名', trigger: ['change', 'blur'] }
      ],
      password: [
        { required: true, message: '请输入密码', trigger: ['change', 'blur'] }
      ],
      captcha: [
        { required: true, message: '请输入验证码', trigger: ['change', 'blur'] }
      ]
    })
    // 获取验证码
    const getCaptcha = () => {
      form.captchaId = Date.now()
      captchaImgUrl.value = imageCaptcha(form.captchaId)
    }
    //初始化国密配置
    const initGmConfig = () => {
      initConfig()
        .then(res => {
          let data = res.data
          gm.value.gmEnable = data.gmEnable
          if (gm.value.gmEnable && gm.value.gmEnable === '0') {
            gm.value.serverRandom = data.serverRandom
          }
        })
        .catch(err => {
          console.log('err', err.msg)
        })
    }
    const checkIsBindUKey = () => {
      isUserBindUKey(form.username)
        .then(res => {
          if (res.data) {
            gm.value.pwdType = 'upas'
            // loadCaCert()
          } else {
            gm.value.pwdType = 'pas'
          }
        })
        .catch(err => {
          console.log('err', err.msg)
        })
    }
    const signAndEncrypt = password => {
      //加密之前再校验下U盾状态
      // var result = loadCaCert()
      // if (!result) {
      //   return result
      // }
      // //获取随机数
      // var random = password + '' + gm.value.serverRandom
      // //加签
      // var sign = caSignData(random)
      // var gmData = {
      //   random: random,
      //   sign: sign
      // }
      // gm.value.gmJson = JSON.stringify(gmData)
      // return result
    }
    const loginFn = () => {
      formRef.value.validate((valid, fields) => {
        if (valid) {
          let params = JSON.parse(JSON.stringify(form))
          let password = myEncrypt(myEncrypt(params.password))
          params.password = password
          if (gm.value.pwdType === 'upas') {
            //加密并签名
            var result = signAndEncrypt(params.password)
            if (!result) {
              params.password = ''
              $message('未检测到唯一USB_KEY设备')
              return
            }
          }
          login(params)
            .then(result => {
              if (+result === 0) {
                $message('登录成功', 'success')
                router.push({
                  name: 'HomePage'
                })
              }
            })
            .catch(err => {
              getCaptcha()
            })
        } else {
          console.log('error submit!', fields)
        }
      })
    }
    onMounted(() => {
      getCaptcha()
      //初始化国密配置
      initGmConfig()
    })
    return {
      captchaImgUrl,
      formRef,
      form,
      rules,
      getCaptcha,
      checkIsBindUKey,
      loginFn
    }
  }
}
</script>

<style lang="stylus" scoped>
@import './index.styl'
</style>
