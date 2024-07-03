<script setup>
import step1 from './Step1.vue'
import step2 from './Step2.vue'
import step3 from './Step3.vue'
import step4 from './Step4.vue'
import { $message } from '../../../plugins/element'
const router = useRouter()
let stepRef = {}
const props = defineProps({
  // 事项id
  itemId: {
    type: String,
    default: ''
  }
})
let iframeForm = ref([{
  FIR_FORM_ID: "61bc914e43d14f708cb50540dda08287",
  FIR_ID: "5b51f9a71aaf46c0a85e2ee90454be8b",
  FIR_SORT: 1,
  FORM_NAME: "幼儿园表单1",
  FORM_PATH: "/customform/formbind",
  URL: "http://172.16.40.43:8080/iframework/api/extranet/formWindow"
}, {
  FIR_FORM_ID: "61bc914e43d14f708cb50540dda08287",
  FIR_ID: "5b51f9a71aaf46c0a85e2ee90454be8b",
  FIR_SORT: 1,
  FORM_NAME: "幼儿园表单2",
  FORM_PATH: "/customform/formbind",
  URL: "http://172.16.40.43:8080/iframework/api/extranet/formWindow"
}])
let currentStep = ref(0) // 当前步骤
let totalStep = ref(0) // 总步骤
// 绑定ref
const setChartRef = (el, type) => {
  if (el) {
    stepRef[`step${type}Ref`] = el
  }
}
// 上一步
const prevHandle = () => {
  currentStep.value--
  console.log('currentStep', currentStep.value)
}
// 下一步
const nextHandle = () => {
  // 第一步保存验证签名必填
  if (currentStep.value === 0 && !stepRef.step1Ref.esignImg) {
    $message('签名必填', 'error')
    return
  }
  // 保存业务表单
  if (currentStep.value > 0 && currentStep.value < (iframeForm.value.length + 1)) {
    stepRef[`step${currentStep.value + 1}Ref`].saveSubmit((res) => {
      if (res === 'success') {
        $message('保存成功', 'success')
        currentStep.value++
      }
    })
    return
  }
  currentStep.value++
  console.log('currentStep', currentStep.value)
}
// 提交
const submitHandle = () => {
  currentStep.value++
  console.log('currentStep', currentStep.value)
}
// 返回
const backHandle = () => {
  router.go(-1)
}
// 返回主页
const backRootHandle = () => {
  router.push({
    name: 'HomePage'
  })
}
// 打印回执单
const printHandle = () => {
  currentStep.value = totalStep.value
}
onBeforeMount(() => {
  totalStep.value = iframeForm.value.length + 3 // 步数从0开始
})
</script>
<template>
  <div class='containerBox'>
    <div class='content'>
      <el-steps :active="currentStep" finish-status="success" process-status="finish" align-center>
        <el-step description="告知信用承诺">
          <template v-slot:title>
            <span>信用承诺</span>
          </template>
        </el-step>
        <el-step description="如实填写办件业务表单信息" v-for="(formItem, index) in iframeForm" :key="index" :title="formItem.FORM_NAME">
          <template v-slot:title>
            <span>{{formItem.FORM_NAME}}</span>
          </template>
        </el-step>
        <el-step description="上传各项附件材料信息">
          <template v-slot:title>
            <span>上传资料</span>
          </template>
        </el-step>
        <el-step description="打印办件回执单据">
          <template v-slot:title>
            <span>打印回执</span>
          </template>
        </el-step>
      </el-steps>
      <div class='stepMain'>
        <step1 :ref='(el) => setChartRef(el, 1)' :itemId='itemId' v-show='currentStep === 0'></step1>
        <div v-show="currentStep > 0 && currentStep <= iframeForm.length" class="h100">
          <template v-for="(formItem, index) in iframeForm" :key="index">
            <step2 :ref="(el) => setChartRef(el, index+2)" v-show="currentStep === index + 1" :itemId='itemId' :formItem='formItem'></step2>
          </template>
        </div>
        <step3 :ref='(el) => setChartRef(el, "submit")' v-show="currentStep === totalStep - 2"></step3>
        <step4 v-show="currentStep === totalStep - 1"></step4>
      </div>
      <el-row class='stepBtn'>
        <el-col :span="24" align='center'>
          <el-button type='primary' v-if='currentStep === 0' @click='backHandle'>返回</el-button>
          <el-button type="primary" v-if="currentStep > 0 && currentStep < totalStep - 1" @click="prevHandle">上一步</el-button>
          <el-button type="danger" v-if="currentStep < totalStep - 2" @click="nextHandle">{{ currentStep === 0 ? '我已阅读并承诺' : '下一步'}}</el-button>
          <el-button type="danger" v-if="currentStep === totalStep - 2" @click="submitHandle">提交</el-button>
          <template v-if="currentStep > iframeForm.length + 1" >
            <el-button type="primary" @click="backRootHandle">返回主页</el-button>
            <el-button type="danger" @click="printHandle">打印回执单</el-button>
          </template>
        </el-col>
      </el-row>
    </div>
  </div>
</template>
<style scoped lang='stylus'>
.content
  height 100%
  position relative
.stepMain
  height calc(100% - 63px - 80px)
  overflow auto
  box-sizing border-box
  margin-top 20px
  :deep(.stepBox)
    height 100%
    border-radius: 4px 4px 4px 4px;
    background: #f2f9ff;
    border 1px solid #D5E7F5
    box-sizing border-box
.el-steps
  :deep(.el-step__title)
    line-height 24px
  :deep(.el-step__description){
    color var(--el-text-color-placeholder) !important
  }
.stepBtn
  padding-top 20px
.h100
  height 100%
</style>
