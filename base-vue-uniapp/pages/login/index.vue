<template lang="pug">
.page-view
  layout(:showStick="true")
    template(slot="main")
      .login-wrap(style="background-image: url(../../static/login/login-bg.png)")
        .c-login-box
          .tips-title {{ '您好，欢迎来到' }}
          .tips-title {{ '四川省机关事务局一体化平台' }}
      .login-box
        .title(v-if="pageStatus !== 'register'") {{ pageTitle }}
        .register-toggle(v-else)
          u-tabs(:list="registerList" @click='toggleTab' :activeStyle="{'color': '#222222'}" :inactiveStyle="{'color': '#898989'}")
        .login-from(v-if="pageStatus === 'login'")
          u--form(ref="formRef" :model="form")
            u-form-item(prop="username")
              img.icon-prefix(style="background-image: url(../../static/login/user.png)")
              u--input(v-model="form.username" border="none" placeholder="请输入用户名")
            u-form-item(prop="password")
              img.icon-prefix(style="background-image: url(../../static/login/password.png)")
              u--input(v-model="form.password" password border="none" placeholder="请输入密码")
            u-form-item(prop="captcha")
              img.icon-prefix(style="background-image: url(../../static/login/captcha.png)")
              u--input.captcha-input(v-model="form.captcha" border="none" placeholder="请输入验证码")
              img.icon-suffix(:src="captchaCode" @click="getCaptchaCode")
          u-button.submit-btn(@click="loginFn") {{ '登  录' }}
          .register-box
            span(@click="changeRegister") {{ '注册' }}
            span {{ '忘记密码？' }}
        .register-select(v-else-if="pageStatus === 'select-register'")
          .register-tips
            //- .legal-register
            .register-layout
              img.icon-register(style="background-image: url(../../static/login/legal-register.png)")
              span.span-register {{ '法人注册' }}
            u-button.go-register(@click="onClickGoRegister('legal')") {{ '去注册' }}
          .register-tips
            .register-layout
              img.icon-register(style="background-image: url(../../static/login/user-register.png)")
              span.span-register {{ '个人注册' }}
            u-button.go-register(@click="onClickGoRegister('user')") {{ '去注册' }}
        .register-form(v-else-if="pageStatus === 'register' && activeId === 0")
          u--form(ref="registerFormRef" :model="registerForm")
            .account-info
              u-form-item.form-item(prop="username")
                img.icon-prefix(style="background-image: url(../../static/login/user.png)")
                u--input.base-input(v-model="registerForm.username" border="none" placeholder="请输入用户名")
              u-form-item.form-item(prop="passWord")
                img.icon-prefix(style="background-image: url(../../static/login/password.png)")
                u--input.base-input(v-model="registerForm.passWord" password border="none" placeholder="请输入密码")
              u-form-item(prop="passWordSure")
                img.icon-prefix(style="background-image: url(../../static/login/password.png)")
                u--input.base-input(v-model="registerForm.passWordSure" password border="none" placeholder="请确认密码")
            .user-base-info
              u-form-item(prop="jbxxCode")
                img.icon-prefix(style="background-image: url(../../static/login/unit.png)")
                u--input.base-input(v-model="registerForm.jbxxCode" border="none" placeholder="单位名称")
                u-action-sheet(v-model="showJbxxCodeAction" :list="jbxxCodeList")
              u-form-item(prop="address")
                img.icon-prefix(style="background-image: url(../../static/login/map.png)")
                u--input.base-input(v-model="registerForm.address" border="none" placeholder="单位地址")
              u-form-item(prop="zipcode")
                img.icon-prefix(style="background-image: url(../../static/login/zip-code.png)")
                u--input.base-input(v-model="registerForm.zipcode" border="none" placeholder="邮编")
              u-form-item(prop="realName")
                img.icon-prefix(style="background-image: url(../../static/login/juridical-name.png)")
                u--input.base-input(v-model="registerForm.realName" border="none" placeholder="法人名称")
              u-form-item(prop="userAge")
                img.icon-prefix(style="background-image: url(../../static/login/user-age.png)")
                u--input.base-input(v-model="registerForm.userAge" border="none" placeholder="法人年龄")
              u-form-item(prop="userSex")
                img.icon-prefix(style="background-image: url(../../static/login/user-sex.png)")
                u--input.base-input(v-model="registerForm.userSex" disabled border="none" placeholder="性别" @click="openActionSheetUserSex")
                u-action-sheet(v-model="showSexAction" :list="userSexList" @click="actionSheetUserSex")
              u-form-item(prop="cardnum")
                img.icon-prefix(style="background-image: url(../../static/login/id-card.png)")
                u--input.base-input(v-model="registerForm.cardnum" border="none" placeholder="法人身份证")
              u-form-item(prop="mobilephone")
                img.icon-prefix(style="background-image: url(../../static/login/mobile.png)")
                u--input.base-input(v-model="registerForm.mobilephone" border="none" placeholder="法人电话号码")
</template>

<script>
import { defineComponent, onMounted, ref, reactive, nextTick, getCurrentInstance } from 'vue'
import { onLoad, onReady } from '@dcloudio/uni-app'
import layout from '@/component/layout'
import { login } from '@/api/login'
import { Base64 } from 'js-base64'
import { API as configApi } from '@/conf/index'
import { userCommonStoreHook } from '@/stores/modules/common'
import { setStorage } from '@/utils/storage'
import { linkJump } from '@/common/common'
import { validateUsername, validatePassword, checkIdCard, checkPostal, validateMobile, validateBlack } from '@/utils/validator'
export default defineComponent({
  name: 'Login',
  components: { layout },
  setup () {
    // 配置信息
    const isProd = import.meta.env.MODE === 'production'
    const BASE_PATH = isProd ? configApi.production : configApi.development
    const instance = getCurrentInstance()
    // 页面状态
    const pageStatus = ref('login')
    const pageTitle = ref('用户登录')
    // 登录
    const form = reactive({
      username: 'chenrun',
      password: 'Aa123456',
      captcha: ''
    })
    const formRef = ref()
    const rules = reactive({
      username: [
        { required: true, message: '用户名不能为空', trigger: 'blur' },
        { required: true, min: 3, message: '不能小于三个字符', trigger: 'blur' }
      ],
      password: [
        { required: true, message: '密码不能为空', trigger: 'blur' }
      ],
      captcha: [
        { required: true, message: '验证码不能为空', trigger: 'blur' }
      ],
    })
    const captchaCode = ref('')
    // 获取短信验证码
    const getCaptchaCode = () => {
      uni.downloadFile({
        url: BASE_PATH['JR'] + `/imageCaptcha?randomId=${Math.random()}`,
        success: res => {
          let setCookie = res.cookies[0] || res.header['Set-Cookie']
          let session = setCookie.slice(0, setCookie.indexOf(';'))
          let sessionId = session.slice(session.indexOf('=') + 1)
          captchaCode.value = res.tempFilePath
          setStorage('JSESSIONID', sessionId)
          // console.log('sessionId', sessionId, getStorage('JSESSIONID'))
        }
      })
    }
    const loginFn = () => {
      formRef.value.validate().then(res => {
        let params = form
        params['password'] = Base64.encode(params.password)
        login(params).then((result) => {
          let data = result.data || {}
          if (result.id === '01') {
            userCommonStoreHook().setSystemInfo(data)
            linkJump('/pages/index/index')
          }
        }).catch((err) => {
          getCaptchaCode()
          console.log('err', err)
        })
      }).catch(error => {
        console.log('submit error!!!', error)
      })
    }
    // 注册
    const activeId = ref(0)
    const registerFormRef = ref()
    const registerForm = reactive({
      username: '',
      passWord: '',
      passWordSure: '',
      jbxxCode: '',
      address: '',
      zipcode: '',
      realName: '',
      userAge: '',
      userSex: '',
      cardnum: '',
      mobilephone: '',
    })
    // 确认密码校验
    const validatePassSure = (rule, value, callback) => {
      if (value !== registerForm.passWord) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    const registerRules = reactive({
      username: [
        { required: true, message: '用户名不能为空', trigger: 'blur' },
        { validator: validateUsername, trigger: 'blur' }
      ],
      passWord: [
        { required: true, message: '密码不能为空', trigger: 'blur' },
        { validator: validatePassword, trigger: 'blur' }
      ],
      passWordSure: [
        { required: true, message: '确认密码不能为空', trigger: 'blur' },
        { validator: validatePassSure, trigger: 'blur' }
      ],
      jbxxCode: [
        { required: true, message: '单位名称不能为空', trigger: 'blur' }
      ],
      address: [
        { required: true, message: '单位地址不能为空', trigger: 'blur' },
        { validator: validateBlack, trigger: 'blur' }
      ],
      zipcode: [
        { required: false, validator: checkPostal, trigger: 'blur' }
      ],
      realName: [
        { required: true, message: '法人名称不能为空', trigger: 'blur' },
        { validator: validateBlack, trigger: 'blur' }
      ],
      userSex: [
        { required: true, message: '性别不能为空', trigger: 'blur' }
      ],
      cardnum: [
        { required: true, message: '法人身份证不能为空', trigger: 'blur' },
        { validator: checkIdCard, trigger: 'blur' }
      ],
      mobilephone: [
        { required: true, message: '法人电话号码不能为空', trigger: 'blur' },
        { validator: validateMobile, trigger: 'blur' }
      ],
    })
    const changeRegister = () => {
      pageStatus.value = 'select-register'
      pageTitle.value = '请选择注册类型'
    }
    const onClickGoRegister = () => {
      pageStatus.value = 'register'
      nextTick(() => {
        instance.proxy.$refs.registerFormRef && instance.proxy.$refs.registerFormRef.setRules(registerRules)
      })
    }
    const registerList = ref([
      {
        id: 0,
        name: '法人注册',
      }, {
        id: 1,
        name: '个人注册',
      }
    ])
    const toggleTab = (item) => {
      activeId.value = item.id
    }
    const jbxxCodeList = ref([
      {
        id: 1,
        text: '男'
      }, {
        id: 2,
        text: '女'
      }
    ])
    const userSexList = ref([
      {
        id: 1,
        text: '男'
      }, {
        id: 2,
        text: '女'
      }
    ])
    // 下拉选择
    const showJbxxCodeAction = ref(false)
    const showSexAction = ref(false)
    // 打开选择下拉框
    const openActionSheetUserSex = () => {
      showSexAction.value = true
      console.log('打开选择下拉框', showSexAction);
    }
    const actionSheetUserSex = (val) => {
      console.log('actionSheetUserSex', val);
    }

    // onLoad 只加载一次，监听页面加载
    onLoad((options) => {

    })
    // onReady 页面初次渲染完成了
    onReady(() => {
      // console.log('onReady', formRef)
    })
    onMounted(() => {
      getCaptchaCode()
      formRef.value.setRules(rules)
      console.log('onMounted', formRef, formRef.value)
    })
    return {
      instance,
      pageTitle,
      pageStatus,
      form,
      formRef,
      loginFn,
      captchaCode,
      getCaptchaCode,
      changeRegister,
      onClickGoRegister,
      registerList,
      activeId,
      registerFormRef,
      registerForm,
      toggleTab,
      actionSheetUserSex,
      openActionSheetUserSex,
      showJbxxCodeAction,
      jbxxCodeList,
      showSexAction,
      userSexList,
    }
  }
})
</script>

<style lang="stylus" scoped>
@import './index.styl'
</style>
