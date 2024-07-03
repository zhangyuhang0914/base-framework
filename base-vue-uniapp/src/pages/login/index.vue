<template lang="pug">
.page-view
  layout(:showStick="true")
    template(slot="main")
      .login-wrap(style="background-image: url(../../static/login/login-bg.png)")
        .c-login-box
          .tips-title {{ '您好，欢迎来到' }}
          .tips-title {{ '四川省机关事务局一体化平台' }}
      .login-box
        .title(v-if="pageStatus === 'login' || pageStatus === 'select-register' || pageStatus === 'forgotPwd'") {{ pageTitle }}
        .register-toggle(v-else)
          u-tabs(:current="activeId" :list="registerList" @click='toggleTab' :activeStyle="{'color': '#222222'}" :inactiveStyle="{'color': '#898989'}")
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
          u-button.submit-btn(@click="loginFn") {{ '登 录' }}
          .register-box
            span(@click="changeRegister") {{ '注册' }}
            span(@click="changeForgotPassword") {{ '忘记密码？' }}
        .register-select(v-else-if="pageStatus === 'select-register'")
          .register-tips
            //- .legal-register
            .register-layout
              img.icon-register(style="background-image: url(../../static/login/legal-register.png)")
              span.span-register {{ '法人注册' }}
            u-button.go-register(@click="onClickGoRegister(0)") {{ '去注册' }}
          .register-tips
            .register-layout
              img.icon-register(style="background-image: url(../../static/login/user-register.png)")
              span.span-register {{ '个人注册' }}
            u-button.go-register(@click="onClickGoRegister(1)") {{ '去注册' }}
        .register-form(v-else-if="pageStatus === 'register' && activeId === 0")
          .aa 123321
        .user-register-form(v-else-if="pageStatus === 'register' && activeId === 1")
          u--form(ref="registerUserFormRef" :model="registerForm")
            .account-info
              .header-info {{ '账号信息' }}
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
              .header-info {{ '用户基本信息' }}
              u-form-item(prop="jbxxCode")
                img.icon-prefix(style="background-image: url(../../static/login/unit.png);z-index: 9;")
                u-input.base-input(v-model="registerForm.jbxxCode" border="none" placeholder="单位名称" readonly)
                .mask-click(@click="openActionSheetUnit()")
                //- c-select(:show="showUnitSelect" name="applName" :showSearch="false" :dataLists="jbxxCodeList" @cancel="showUnitSelect = false")
                u-picker(
                  title="选择单位"
                  :show="showUnitSelect"
                  :columns="jbxxCodeList"
                  @cancel="showUnitSelect = false"
                  @close="showUnitSelect = false"
                  @confirm="changeSheetUnit"
                  :closeOnClickOverlay="true"
                )
              u-form-item(prop="address")
                img.icon-prefix(style="background-image: url(../../static/login/map.png)")
                u--input.base-input(v-model="registerForm.address" border="none" placeholder="单位地址")
              u-form-item(prop="zipcode")
                img.icon-prefix(style="background-image: url(../../static/login/zip-code.png)")
                u--input.base-input(v-model="registerForm.zipcode" border="none" placeholder="邮编")
              u-form-item(prop="realName")
                img.icon-prefix(style="background-image: url(../../static/login/juridical-name.png)")
                u--input.base-input(v-model="registerForm.realName" border="none" placeholder="名称")
              u-form-item(prop="userAge")
                img.icon-prefix(style="background-image: url(../../static/login/user-age.png)")
                u--input.base-input(v-model="registerForm.userAge" border="none" placeholder="年龄")
              u-form-item(prop="userSex")
                img.icon-prefix(style="background-image: url(../../static/login/user-sex.png);z-index: 9;")
                u-input.base-input(v-model="registerForm.userSex" border="none" placeholder="性别" readonly)
                .mask-click(@click="openActionSheetUserSex()")
                u-picker(
                  title="选择性别"
                  :show="showSexSelect"
                  :columns="userSexList"
                  @cancel="closeSexSelect"
                  @close="closeSexSelect"
                  @confirm="changeSheetUserSex"
                  :closeOnClickOverlay="true"
                )
              u-form-item(prop="cardnum")
                img.icon-prefix(style="background-image: url(../../static/login/id-card.png)")
                u--input.base-input(v-model="registerForm.cardnum" border="none" placeholder="身份证")
              u-form-item(prop="mobilephone")
                img.icon-prefix(style="background-image: url(../../static/login/mobile.png)")
                u--input.base-input(v-model="registerForm.mobilephone" border="none" placeholder="电话号码")
            .c-footer
              u-button.submit-btn(@click="onSubmitRegister(1)") {{ '提 交' }}
              u-button.back-btn(@click="onBack") {{ '返 回' }}
        .forgot-form(v-else-if="pageStatus === 'forgotPwd'")
          u--form(ref="forgotPwdFormRef" :model="forgotPwdForm")
            u-form-item.form-item(prop="newPassword")
              img.icon-prefix(style="background-image: url(../../static/login/password.png)")
              u--input.base-input(v-model="forgotPwdForm.newPassword" password border="none" placeholder="新密码")
            u-form-item(prop="passwordSure")
              img.icon-prefix(style="background-image: url(../../static/login/password.png)")
              u--input.base-input(v-model="forgotPwdForm.passwordSure" password border="none" placeholder="新密码确认")
            u-form-item(prop="phone")
              img.icon-prefix(style="background-image: url(../../static/login/mobile.png)")
              u--input.base-input(v-model="forgotPwdForm.phone" border="none" placeholder="手机号")
            u-form-item(prop="captcha")
              img.icon-prefix(style="background-image: url(../../static/login/captcha.png)")
              u--input.captcha-button(v-model="forgotPwdForm.captcha" border="none" placeholder="手机验证码")
              u-button.icon-suffix-captcha-success(v-if="sendTime" disabled) {{ `重新获取验证码（${sendTime}）秒` }}
              u-button.icon-suffix-captcha(v-else @click="sendPhoneCaptcha") {{ '发送验证码' }}
          .c-footer
            u-button.submit-btn(@click="onSubmitReset") {{ '提 交' }}
            u-button.back-btn(@click="onBack") {{ '返 回' }}
</template>

<script>
import { defineComponent, onMounted, ref, reactive, nextTick, getCurrentInstance, watch } from 'vue'
import { onLoad, onReady } from '@dcloudio/uni-app'
import layout from '@/component/layout'
import CSelect from '@/component/c-select'
import { login, getYApplJbxxList, register, sendsms, resetPassword } from '@/api/login'
import { Base64 } from 'js-base64'
import { API as configApi } from '@/conf/index'
import { userCommonStoreHook } from '@/stores/modules/common'
import { setStorage } from '@/utils/storage'
import { linkJump } from '@/common/common'
import { validateUsername, validatePassword, checkIdCard, checkPostal, validateMobile, validateBlack } from '@/utils/validator'
export default defineComponent({
  name: 'Login',
  components: { layout, CSelect },
  setup () {
    // 配置信息
    const isProd = import.meta.env.MODE === 'production'
    const BASE_PATH = isProd ? configApi.production : configApi.development
    const instance = getCurrentInstance()
    // 页面状态
    const pageStatus = ref('login')
    const pageTitle = ref('用户登录')
    // 登录表单
    const form = reactive({
      username: 'chenrun',
      password: 'Aa123456',
      captcha: ''
    })
    const formRef = ref(null)
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
    const jbxxCodeList = ref([[]])
    const unitOptionList = ref([])
    // 获取机构列表
    const getYApplJbxxListData = () => {
      getYApplJbxxList().then((result) => {
        let data = result.data || []
        if (result.id === '01') {
          data.forEach(item => {
            jbxxCodeList.value[0].push(item['applName'])
          })
          unitOptionList.value = data
        }
      }).catch((err) => {
        console.log('err', err)
      })
    }
    // 登录
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
    const registerUserFormRef = ref(null)
    // 注册表单
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
    const showUnitSelect = ref(false)
    const showSexSelect = ref(false)
    // 注册确认密码校验
    const registerValidatePassSure = (rule, value, callback) => {
      if (value !== registerForm.passWord) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    // 个人注册
    const userRegisterRules = reactive({
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
        { validator: registerValidatePassSure, trigger: 'blur' }
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
    // 注册
    const changeRegister = () => {
      pageStatus.value = 'select-register'
      pageTitle.value = '请选择注册类型'
    }
    // 去注册
    const onClickGoRegister = (status) => {
      activeId.value = status
      pageStatus.value = 'register'
      nextTick(() => {
        if (activeId.value === 1) {
          instance.proxy.$refs.registerUserFormRef && instance.proxy.$refs.registerUserFormRef.setRules(userRegisterRules)
        }
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
    // 切换tab
    const toggleTab = (item) => {
      activeId.value = item.id
    }
    const userSexList = ref([
      ['男', '女']
    ])
    // 打开单位选择
    const openActionSheetUnit = () => {
      showUnitSelect.value = true
    }
    // 选择单位
    const changeSheetUnit = (val) => {
      if (!val) return false
      registerForm.jbxxCode = val.value[0] || ''
      instance.proxy.$refs.registerUserFormRef.validateField('jbxxCode', valid => {})
      showUnitSelect.value = false
    }
    // 打开性别选择下拉框
    const openActionSheetUserSex = () => {
      showSexSelect.value = true
    }
    // 关闭性别选择器
    const closeSexSelect = () => {
      showSexSelect.value = false
    }
    // 选择性别
    const changeSheetUserSex = (val) => {
      if (!val) return false
      registerForm.userSex = val.value[0] || ''
      instance.proxy.$refs.registerUserFormRef.validateField('userSex', valid => {})
      closeSexSelect()
    }
    // 注册
    const onSubmitRegister = (type) => {
      // 法人注册
      if (activeId.value === type) {
        console.log('法人注册', registerForm, registerForm)
        registerUserFormRef.value.validate().then(res => {
          let params = JSON.parse(JSON.stringify(registerForm))
          if (params['jbxxCode']) {
            unitOptionList.value.forEach(item => {
              if (item['applName'] === params['jbxxCode']) {
                params['jbxxCode'] = item.applId || ''
              }
            })
          }
          if (params['userSex']) {
            params['userSex'] = params['userSex'] === '男' ? '1' : '2'
          }
          console.log('params', params)
          register(params).then((result) => {
            console.log('register', result)
            if (result.id === '01') {
              uni.$u.toast(result.msg || '')
              clearUserRegisterForm()
            }
          }).catch((err) => {
            console.log('err', err)
          })
        }).catch(error => {
          console.log('submit error!!!', error)
        })
      }
    }
    const forgotPwdFormRef = ref(null)
    const sendTime = ref(0)
    const sendTimeInter = ref(null)
    // 忘记密码表单
    const forgotPwdForm = reactive({
      newPassword: '',
      passwordSure: '',
      phone: '',
      captcha: ''
    })
    // 发送验证码
    const sendPhoneCaptcha = () => {
      if (!forgotPwdForm.phone) {
        uni.$u.toast('请先填写手机号码')
        return
      }
      if (!/^([+]?[\d]{1,3}-|[ ])?((13[0-9]{9})|(18[0-9]{9})|(15[0-9]{9})|(16[0-9]{9})|(14[0-9]{9})|(17[0-9]{9})|(19[0-9]{9}))$/.test(forgotPwdForm.phone)) {
        uni.$u.toast('请输入正确的手机号码')
        return
      }
      let params = {
        phone: forgotPwdForm.phone
      }
      sendsms(params).then(res => {
        uni.$u.toast('发送成功')
        sendsmsSuccess()
      }).catch(err => {
        console.log('err', err)
      })
    }
    // 发送验证码成功添加倒计时
    const sendsmsSuccess = () => {
      sendTime.value = 60
      sendTimeInter && clearInterval(sendTimeInter)
      sendTimeInter.value = setInterval(() => {
        sendTime.value -= 1
        if (!sendTime.value) {
          clearInterval(sendTimeInter.value)
        }
      }, 1 * 1000)
    }
    // 忘记密码确认密码校验
    const forgotPwdValidatePassSure = (rule, value, callback) => {
      if (value !== forgotPwdForm.newPassword) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    // 忘记密码表单校验
    const forgotPasswordRules = reactive({
      newPassword: [
        { pattern: /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)[A-Za-z\d]{8,20}$/, message: '密码长度为8~20个字符，必须同时包含数字、大写字母和小写字母', trigger: 'blur' },
        { required: true, message: '新密码不能为空', trigger: 'blur' }
      ],
      passwordSure: [
        { required: true, message: '确认密码不能为空', trigger: 'blur' },
        { validator: forgotPwdValidatePassSure, trigger: 'blur' }
      ],
      phone: [
        { required: true, message: '手机号不能为空', trigger: 'blur' },
        { validator: validateMobile, trigger: 'blur' }
      ],
      captcha: [
        { required: true, message: '手机验证码不能为空', trigger: 'blur' }
      ]
    })
    // 忘记密码
    const changeForgotPassword = () => {
      pageStatus.value = 'forgotPwd'
      pageTitle.value = '忘记密码'
      nextTick(() => {
        instance.proxy.$refs.forgotPwdFormRef && instance.proxy.$refs.forgotPwdFormRef.setRules(forgotPasswordRules)
      })
    }
    // 提交-忘记密码
    const onSubmitReset = () => {
      forgotPwdFormRef.value.validate().then(res => {
        let params = JSON.parse(JSON.stringify(forgotPwdForm))
        delete params.passwordSure
        params.newPassword = Base64.encode(params.newPassword)
        resetPassword(params).then((result) => {
          if (result.id === '01') {
            uni.$u.toast(result.msg || '')
            clearForgotPwdForm()
          }
        }).catch((err) => {
          console.log('err', err)
        })
      }).catch(error => {
        console.log('submit error!!!', error)
      })
    }
    // 返回登录
    const onBack = () => {
      pageStatus.value = 'login'
      pageTitle.value = '用户登录'
      nextTick(() => {
        instance.proxy.$refs.formRef && instance.proxy.$refs.formRef.setRules(rules)
      })
    }
    // 清空个人用户注册表单
    const clearUserRegisterForm = () => {
      for (const key in registerForm) {
        registerForm[key] = ''
      }
      pageStatus.value = 'login'
      pageTitle.value = '用户登录'
      nextTick(() => {
        instance.proxy.$refs.formRef && instance.proxy.$refs.formRef.setRules(rules)
      })
    }
    // 清空忘记密码表单
    const clearForgotPwdForm = () => {
      for (const key in forgotPwdForm) {
        forgotPwdForm[key] = ''
      }
      clearInterval(sendTimeInter.value)
      sendTime.value = 0
      pageStatus.value = 'login'
      pageTitle.value = '用户登录'
      nextTick(() => {
        instance.proxy.$refs.formRef && instance.proxy.$refs.formRef.setRules(rules)
      })
    }

    // 监听tabs变化
    watch(() => activeId.value, (val) => {
      nextTick(() => {
        if (val === 1) {
          instance.proxy.$refs.registerUserFormRef && instance.proxy.$refs.registerUserFormRef.setRules(userRegisterRules)
        }
      })
    })
    // onLoad 只加载一次，监听页面加载
    onLoad((options) => {})
    // onReady 页面初次渲染完成了
    onReady(() => {})
    onMounted(() => {
      getCaptchaCode()
      getYApplJbxxListData()
      formRef.value.setRules(rules)
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
      changeForgotPassword,
      onClickGoRegister,
      registerList,
      activeId,
      registerUserFormRef,
      registerForm,
      forgotPwdFormRef,
      forgotPwdForm,
      sendTime,
      sendTimeInter,
      sendPhoneCaptcha,
      onSubmitReset,
      toggleTab,
      changeSheetUserSex,
      openActionSheetUserSex,
      openActionSheetUnit,
      changeSheetUnit,
      closeSexSelect,
      showUnitSelect,
      jbxxCodeList,
      unitOptionList,
      showSexSelect,
      userSexList,
      onSubmitRegister,
      onBack
    }
  }
})
</script>

<style lang="stylus" scoped>
@import './index.styl'
</style>
