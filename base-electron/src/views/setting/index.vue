<template lang="pug">
.setting-box
  .system-setting(v-loading="loading")
    .setting-name {{ '自助机配置' }}
    img(v-if="takePhotoUrl" :src="takePhotoUrl" style="width:100px;height:100px")
    el-form(ref="formRef" :model="form" :rules="rules" label-width="120px")
      el-row(:gutter="24")
        el-col(:span="19")
          el-form-item(prop="locationUrl" label="服务器地址：")
            el-input(v-model="form.locationUrl" placeholder="请输入服务器地址")
        el-col(:span="2")
          .show-code(@click="onClickLocation")
            img(:src="`${BASE_URL}images/setting/qr-code.png`")
        el-col(:span="3")
          el-button(type="primary" @click="checkService('test')") {{ '测试' }}
      el-row(:gutter="24")
        el-col.terminal(:span="24")
          el-form-item(prop="terminal" label="终端：")
            el-select(v-model="form.terminal" placeholder="请选择终端" @change="changeTerminal" clearable)
              el-option(v-for="(item, index) in terminalList" :key="index" :label="item.label" :value="item.value")
      el-row(:gutter="24" v-if="form.terminal")
        el-col(:span="24")
          el-form-item(label="终端信息：")
            .terminal-info(v-for="(item, index) in terminalInfo" :key="index")
              .label {{ item.label }}
              .value {{ item.value }}
      el-row(:gutter="24")
        el-col(:span="24")
          .opeartion-footer
            el-button(type="primary" @click="handleQuit") {{ '退出自助机软件' }}
            el-button(type="primary" @click="handleEnter")
              span {{ '进入' }}
              span(v-if="countdown > 0") {{ `（${countdown}）` }}
  CameraDialog(
    v-if="cameraVisible"
    :types="['scan', 'photo']"
    :visible="cameraVisible"
    @jsqrCallback="jsqrCallback"
    @photoCallback="photoCallback"
    @close="closeDialog"
  )
</template>

<script>
import { ref, reactive, getCurrentInstance, onMounted } from 'vue'
import { test } from '@/apis/common'
import { useRouter } from 'vue-router'
import { Store } from '@/commons/store'
import { $message } from '@/plugins/element'
import { userCommonStoreHook } from '@/stores/modules/common'
import CameraDialog from '@/components/camera-dialog/index.vue'
export default {
  name: 'Setting',
  components: { CameraDialog },
  setup() {
    // 当前组件实例
    const global = getCurrentInstance().appContext.config.globalProperties
    // 路由
    const router = useRouter()
    const BASE_URL = import.meta.env.BASE_URL
    const loading = ref(false)
    // 终端
    const terminalList = reactive([
      {
        label: '终端编号 XYJT010',
        value: '010',
        name: '武汉智慧交通自助机',
        code: 'XYJT010',
        location: '武汉交通局一楼大厅',
        desc: '自主办理'
      },
      {
        label: '终端编号 XYJT018',
        value: '018',
        name: '襄阳智慧交通自助机',
        code: 'XYJT018',
        location: '襄阳交通局一楼大厅',
        desc: '自主办理'
      }
    ])
    // 设置表单
    const formRef = ref(null)
    const form = reactive({
      locationUrl: '',
      terminal: ''
    })
    const rules = reactive({
      locationUrl: [
        {
          required: true,
          message: '请输入服务器地址',
          trigger: ['change', 'blur']
        }
      ],
      terminal: [
        { required: true, message: '请选择终端', trigger: ['change', 'blur'] }
      ]
    })
    const terminalInfo = reactive([
      {
        label: '名称',
        key: 'name',
        value: ''
      },
      {
        label: '编号',
        key: 'code',
        value: ''
      },
      {
        label: '摆放位置',
        key: 'location',
        value: ''
      },
      {
        label: '用途说明',
        key: 'desc',
        value: ''
      }
    ])
    const countdown = ref(3)
    const timer = ref(null)
    const cameraVisible = ref(false)
    const onClickLocation = () => {
      cameraVisible.value = true
    }
    const jsqrCallback = data => {
      form.locationUrl = data
      closeDialog()
    }
    const closeDialog = () => {
      cameraVisible.value = false
    }
    // 测试拍照
    const takePhotoUrl = ref('')
    const photoCallback = data => {
      takePhotoUrl.value = data
    }
    // 测试服务器地址
    const checkService = async type => {
      if (!form.locationUrl) return false
      return new Promise((resolve, reject) => {
        loading.value = true
        test({
          captchaId: Date.now(),
          testUrl: form.locationUrl
        })
          .then(result => {
            loading.value = false
            if (result.data) {
              type === 'test' ? $message('服务器地址连接正常', 'success') : ''
              resolve(true)
            } else if (result.code === 'ERR_NETWORK') {
              // 网络异常
              resolve(false)
            }
          })
          .finally(() => {
            loading.value = false
          })
      })
    }
    // 倒计时
    const startCountDown = () => {
      timer.value = setInterval(() => {
        countdown.value--
        if (countdown.value <= 0) {
          clearInterval(timer.value)
          handleEnter()
        }
      }, 1000)
    }
    // 选择终端
    const changeTerminal = value => {
      if (!value) return false
      getCacheTerminal(value)
    }
    // 获取终端信息
    const getCacheTerminal = value => {
      for (let index = 0; index < terminalList.length; index++) {
        if (value === terminalList[index].value) {
          terminalInfo.forEach(item => {
            item.value = terminalList[index][item.key]
          })
        }
      }
    }
    // 退出自助机
    const handleQuit = () => {
      Store.quit()
    }
    // 进入页面
    const handleEnter = async () => {
      router.push({
        name: 'HomePage'
      })
      let a = true
      if (a) return false
      if (!(await checkService())) return false
      formRef.value &&
        formRef.value.validate((valid, fields) => {
          if (valid) {
            Store.setItem('base_url', form.locationUrl)
            Store.setItem('terminal', form.terminal)
            userCommonStoreHook().setBaseUrl(form.locationUrl)
            router.push({
              name: 'HomePage'
            })
            // 提前进入清空倒计时
            if (timer.value) {
              clearInterval(timer.value)
            }
          } else {
            console.log('error submit!', fields)
          }
        })
    }
    onMounted(async () => {
      form.locationUrl = await Store.getItem('base_url')
      form.terminal = await Store.getItem('terminal')
      startCountDown()
      if (form.terminal) getCacheTerminal(form.terminal)
    })
    return {
      BASE_URL,
      loading,
      terminalList,
      formRef,
      form,
      rules,
      terminalInfo,
      countdown,
      cameraVisible,
      takePhotoUrl,
      photoCallback,
      onClickLocation,
      jsqrCallback,
      closeDialog,
      checkService,
      changeTerminal,
      handleQuit,
      handleEnter
    }
  }
}
</script>

<style lang="stylus" scoped>
@import './index.styl'
</style>
