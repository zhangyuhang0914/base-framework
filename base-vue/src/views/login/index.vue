<template lang="pug">
.login-wrap
  el-form(ref="formRef" :model="formData" :rules="formRules" label-width="80px")
    el-form-item(prop="username" label="用户名")
      el-input(v-model="formData.username")
    el-form-item(prop="password" label="密码")
      el-input(v-model="formData.password" type="password")
    el-form-item(prop="captcha" label="验证码")
      el-input(v-model="formData.captcha")
        template(#append)
          //- img(:src="formData.captcha")
          img.append-img(src="https://fastly.jsdelivr.net/npm/@vant/assets/logo.png")
    el-form-item
      el-button(type="primary" @click="loginFn") {{ '登录' }}
      CUpload(ref="uploadRef")
      el-button(type="primary") {{ '取消' }}
</template>

<script>
import {
  defineComponent,
  onMounted,
  reactive,
  ref,
  shallowRef,
  getCurrentInstance
} from 'vue'
import { login, imageCaptcha } from '@/apis/login'
import CUpload from '@/components/c-upload/index.vue'
import { $message } from '@/plugins/element'
export default defineComponent({
  name: 'login',
  components: { CUpload },
  setup(props, { emit }) {
    const instance = getCurrentInstance()
    const config = instance.appContext.config.globalProperties
    const formRef = ref(null)
    const uploadRef = shallowRef(null)
    const formData = reactive({
      username: '',
      password: '',
      captcha: ''
    })
    const formRules = reactive({
      username: [
        { required: true, message: '请输入用户名', trigger: ['blur', 'change'] }
      ],
      password: [
        { required: true, message: '请输入密码', trigger: ['blur', 'change'] },
        {
          validator: config.$validate.isPassword,
          message: '请输入正确的密码',
          trigger: ['blur', 'change']
        }
      ],
      captcha: [
        { required: true, message: '请输入验证码', trigger: ['blur', 'change'] }
      ]
    })
    const getCaptcha = () => {
      imageCaptcha()
        .then(result => {
          console.log('111')
        })
        .catch(err => {
          $message(err.msg)
        })
    }
    const loginFn = () => {
      formRef.value.validate((valid, fields) => {
        console.log('valid, fields', valid, fields)
        if (valid) {
          let params = {
            a: 1
          }
          login(params)
            .then(result => {
              console.log('result', result)
            })
            .catch(err => {
              console.log('err', err)
            })
        }
      })
    }
    onMounted(() => {
      getCaptcha()
    })
    return {
      formRef,
      uploadRef,
      formData,
      formRules,
      loginFn
    }
  }
})
</script>

<style lang="stylus" scoped>
@import './index.styl'
</style>
