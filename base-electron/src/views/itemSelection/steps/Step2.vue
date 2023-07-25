<script setup>
import {saveFormData} from '../../../apis/itemHandle'
let iframeFormInfo = ref({})
let communication = null
let iframeUrl = ref('')
let iframeHeight = ref('100%')
let formIframe = ref(null)
const props = defineProps({
  // 事项id
  itemId: {
    type: String,
    default: ''
  },
  // 嵌套表单
  formItem: {
    type: Object,
    default () {
      return {}
    }
  },
  ext: {
    type: Object,
    default () {
      return {}
    }
  }
})

// 初始化页面
const init = () => {
  iframeFormInfo.value = props.formItem
  let editOrView = '1' // 查看传0编辑传1
  iframeUrl.value = `${iframeFormInfo.value.URL}?extId=${props.ext.extId}&itemId=${props.itemId}&applicationid=${props.ext.extApplicantid}&editOrView=${editOrView}&extSubmitPathway=0&formid=${iframeFormInfo.value.FIR_FORM_ID}&path=${iframeFormInfo.value.FORM_PATH}`
}

// 初始化父子iframe通讯
/* eslint-disable */
const initCommunication = () => {
  let formIframe = formIframe.value.contentWindow
  communication = new Communication(formIframe)
  communication.init()
  communication.receiverAction = (data, event) => {
    if (data.action === 'onload') {
      sendUserInfo()
    }
    // 设置高度
    if (data.action === 'setHeight') {
      iframeHeight.value = data.height
      // _this.$emit('setStepMainHeight', 'true')
    }
  }
}
// 发送登录用户信息
const sendUserInfo = () => {
  let msg = {
    action: 'setUser',
    userInfo: {}
  }
  communication.put(msg)
}
// 保存业务表单
const saveSubmit = (callback) => {
  let msg = {
    action: 'save'
  }
  callback && callback('success')
  return
  this.communication.get(msg, (res) => {
    // 保存成功
    if (res.data.state === 'success') {
      if(iframeFormInfo.value.FORM_PATH === '/otherapp/formbind') {
        saveForm(callback)
      } else {
        callback && callback('success')
      }
    } else {
      callback && callback('error')
    }
  })
}
// 保存第三方业务表单
const saveForm = (callback) => {
  let msg = {
    action: 'form.getData'
  }
  communication.get(msg, (data) => {
    if (data.data.state === 'success'){
      let params = {
        extId: this.ext.extId,
        formId: this.iframeFormInfo.FIR_FORM_ID,
        formData: data.data.formData
      }
      saveFormData(params).then(res => {
        callback && callback('success')
      }).catch(err => {
        callback && callback('error')
      })
    }else {
      callback && callback('error')
    }
  })
}

onMounted(() => {
  init()
})
defineExpose({ saveSubmit })
</script>
<template>
  <div class='h100'>
    <iframe :src="iframeUrl" ref="formIframe" frameborder="0" width="100%" :height="iframeHeight" onload=""></iframe>
  </div>
</template>
<style scoped lang='stylus'>
.h100
  height 100%
</style>
