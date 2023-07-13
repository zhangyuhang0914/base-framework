<template lang="pug">
.system-setting
  el-form(ref="formRef" :model="form" :rules="rules" label-width="120px")
    el-row(:gutter="24")
      el-col(:span="16")
        el-form-item(prop="locationUrl" label="服务器地址")
          el-input(v-model="form.locationUrl" placeholder="请输入服务器地址")
      el-col(:span="4")
        span {{ '二维码' }}
      el-col(:span="4")
        el-button(type="primary") {{ '测试' }}
    el-row(:gutter="24")
      el-col(:span="24")
        el-form-item(prop="terminal" label="终端")
          el-select(v-model="form.terminal" placeholder="请选择终端")
            el-option(v-for="(item, index) in terminalList" :key="index" :label="item.label" :value="item.value")
    el-row(:gutter="24")
      el-col(:span="24")
        el-form-item(label="终端信息")
          el-row
            el-col(:span="12" v-for="(item, index) in terminalInfo" :key="index")
              .terminal-info
                .label {{ item.label }}
                .value {{ item.value }}
  .opeartion-footer
    el-button(type="primary" @click="handleQuit") {{ '退出自助机软件' }}
    el-button(type="primary" @click="handleEnter") {{ '进入' }}
</template>

<script>
import { ref, reactive, getCurrentInstance } from 'vue'
import { useRouter } from 'vue-router'
export default {
  name: 'HeaderCommon',
  setup() {
    // 当前组件实例
    const global = getCurrentInstance().appContext.config.globalProperties
    // 路由
    const router = useRouter()
    // 终端
    const terminalList = reactive([
      {
        label: '正式环境',
        value: '1118'
      }, {
        label: '测试环境',
        value: '1117'
      }
    ])
    // 设置表单
    const formRef = ref(null)
    const form = reactive({
      locationUrl: '192.168.1.246',
      terminal: ''
    })
    console.log('electronStore', global.$electronStore)
    const rules = reactive({
      locationUrl: [
        { required: true, message: '请输入服务器地址', trigger: ['change', 'blur'] }
      ],
      terminal: [
        { required: true, message: '请选择终端', trigger: ['change', 'blur'] }
      ]
    })
    const terminalInfo = reactive([
      {
        label: '名称',
        key: 'name',
        value: '名称11'
      }, {
        label: '编号',
        key: 'code',
        value: '编号11'
      }, {
        label: '摆放位置',
        key: 'location',
        value: '摆放位置11'
      }, {
        label: '用途说明',
        key: 'desc',
        value: '用途说明11'
      }
    ])
    // 退出自助机
    const handleQuit = () => {
      global.$ipcRenderer.send('quitApp', true)
    }
    // 进入页面
    const handleEnter = () => {
      router.push({
        name: 'HomePage'
      })
    }
    return {
      terminalList,
      formRef,
      form,
      rules,
      terminalInfo,
      handleQuit,
      handleEnter
    }
  }
}
</script>

<style lang="stylus" scoped>
@import './index.styl'
</style>
