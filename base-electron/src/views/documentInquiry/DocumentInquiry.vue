<script setup>
// 引入虚拟键盘simple-keyboard
// import SimpleKeyboard from '../../components/simple-keyboard/index.vue'
// let search = ref('')
// let showKeyboard = ref(false)
// let SimpleKeyboardRef = ref('')
// 输入框聚焦事件
// const onInputFocus = val => {
//   showKeyboard.value = true
//   // 父组件调用子组件的方法
//   nextTick(() => {
//     SimpleKeyboardRef.value.onKeysPress('{clear}')
//   })
// }
// 键盘按下事件
// const onChangeKeyboard = input => {
//   search.value = input
// }
// 调用父组件方法
// const parentMethods = funcName => {
//   if (funcName === 'closekeyboard') {
//     closekeyboard()
//   }
// }
// 点击关闭隐藏键盘
// const closekeyboard = () => {
//   showKeyboard.value = false
// }


import {exec} from 'child_process'
import CameraStream from '@/commons/camera-stream'
const router = useRouter()
let search = ref('')
let resultShow = ref(false)
let resultForm = ref({})
const resultFormItems = ref([
  {
    label: '办件编号',
    prop: 'name',
    col: 24
  }, {
    label: '办件名称',
    prop: 'name',
    col: 24
  }, {
    label: '受理部门',
    prop: 'name',
    col: 12
  }, {
    label: '受理时间',
    prop: 'name',
    col: 12
  }, {
    label: '办件状态',
    prop: 'name',
    col: 12
  }, {
    label: '办理时间',
    prop: 'name',
    col: 12
  }
])
// 初始化表单
const initResultForm = () => {
  resultFormItems.value.forEach(item => {
    resultForm.value[item.prop] = '123'
  })
}
// 输入框聚焦弹出系统屏幕键盘
const onInputFocus = val => {
  exec('osk.exe')
}
// 输入框失去焦点关闭系统屏幕键盘
const onInputBlur = val => {
  // 需要用管理员的身份才能关闭
  exec('taskkill /f /t /im osk.exe')
}
// 返回
const backHandle = () => {
  if (resultShow.value) {
    resultShow.value = false
    return
  }
  router.push({
    name: 'HomePage'
  })
}
// 扫描二维码获取办件编号
let qrDlg = ref(false)
const cameraInstance = new CameraStream({
  containerId: 'qrVideoContainer',
  jsqrCallback (res) {
    search.value = res
    cameraInstance.closeCamera()
    qrDlg.value = false
  }
})
// 扫描二维码
const qrCodeHandle = () => {
  qrDlg.value = true
  // 打开摄像头
  cameraInstance.openCamera()
}
// 关闭弹框关闭摄像头
const qrDlgClosed = () => {
  cameraInstance.closeCamera()
}
// 查询事项
const searchHandle = () => {
  resultShow.value = true
}

onBeforeMount(() => {
  initResultForm()
  // 监听鼠标按键，防切屏操作
  // document.onkeydown = (event) => {
  //   console.log(event)
  //   var e = event || window.event
  //   if (e && e.keyCode == 27) {
  //     alert("按 Esc")
  //   }
  //   if (e && e.keyCode == 32) {
  //     alert("按空格")
  //   }
  //   if (e && e.keyCode == 13) {
  //     alert("按回车")
  //   }
  // }
})
</script>
<template>
  <div class='containerBox'>
    <div class='title'>办件查询</div>
    <div class='content'>
      <div class='main'>
        <div class='search' v-if='!resultShow'>
          <div class='label'>办件编号：</div>
          <el-input v-model="search" clearable @focus="onInputFocus" @blur='onInputBlur' size="large" placeholder="请输入办件编号" />
          <div class='qrCode' @click='qrCodeHandle'></div>
        </div>
        <div class='searchResult' v-if='resultShow'>
          <el-form :model="resultForm" label-width="120px">
            <el-row>
              <el-col v-for='(item, index) in resultFormItems' :key='index' :span='item.col'>
                <el-form-item :label='item.label'>
                  {{resultForm[item.prop]}}
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </div>
        <el-row class='bottomBtn'>
          <el-col :span="24" align='center'>
            <el-button type='primary' @click='backHandle'>返回</el-button>
            <el-button type="primary" v-if='!resultShow' @click='searchHandle'>查询</el-button>
          </el-col>
        </el-row>
      </div>
    </div>
    <el-dialog
      class='customDlg customNoFooterDlg'
      v-model="qrDlg"
      title="扫描二维码"
      destroy-on-close
      :modal='true'
      @closed='qrDlgClosed'>
      <div id='qrVideoContainer'></div>
    </el-dialog>
<!--    <simple-keyboard-->
<!--      v-show='showKeyboard'-->
<!--      ref="SimpleKeyboardRef"-->
<!--      @onChange="onChangeKeyboard"-->
<!--      @parentMethods="parentMethods">-->
<!--    </simple-keyboard>-->
  </div>
</template>
<style scoped lang='stylus'>
.main
  width 80%
  margin 0 auto
  padding-top 30px
.search
  display flex
  align-items center
  font-size 20px
  .label
    width 130px
  .qrCode
    width 40px
    min-width 40px
    height 40px
    background #36A4FF url("/images/setting/qr-code.png") no-repeat center center
    background-size 20px 20px
    border-radius 50%
    margin-left 20px
    cursor pointer
.bottomBtn
  margin-top 50px
#qrVideoContainer
  text-align center
  height 100%
</style>
