<template lang="pug">
.page-wrap
  .submit-website
    el-tag(type="info") {{ '多个系统域名/IP请用";"隔开，域名/IP作用于脚本注入到哪些网页（仅登录页有效）' }}
    el-form(:model="formData" :rules="rules" ref="formRef")
      el-form-item(prop="webBindInput")
        el-input(v-model="formData.webBindInput" placeholder="请设置系统域名/IP，以http://或https://开头" clearable @blur="inputBlur")
          template(#prepend) {{ '系统域名/IP' }}
      el-button(type="primary" @click="handleSubmit(formRef)") {{ '提交' }}
</template>
<script lang="ts">
import { defineComponent, ref, reactive, onMounted } from 'vue'
import { Tools } from '@element-plus/icons-vue'
import type { FormRules } from 'element-plus'
import { $message } from '@/plugins/element'

// const domainRegex =
//   /^(http:\/\/|https:\/\/)(([a-zA-Z\d-]+\.)+[a-zA-Z]{2,}|(\d{1,3}\.){3}\d{1,3})(\/[^\s]*)?$/
// const domainRegex = /^(http:\/\/|https:\/\/)([a-zA-Z\d-]+\.)+[a-zA-Z]{2,}(\/[^\s]*)?(;(http:\/\/|https:\/\/)([a-zA-Z\d-]+\.)+[a-zA-Z]{2,}(\/[^\s]*)?)*$/
export default defineComponent({
  name: 'App',
  components: {
    Tools
  },
  setup() {
    const formData = reactive({
      webBindInput: ''
    })
    const formRef = ref(null)
    const ruleForm = reactive({
      webBindInput: ''
    })
    const rules = reactive<FormRules<typeof ruleForm>>({
      webBindInput: [
        {
          required: true,
          validator: (rule: any, value: string, callback: any) => {
            if (!value) {
              return callback(new Error('请设置系统域名/IP'))
            }
            // // 将输入按分号分割成多个域名
            // const domains = value
            //   .split(/\s*;\s*/)
            //   .map(domain => domain.trim())
            //   .filter(Boolean)
            // console.log('domains', domains)
            // // @ts-ignore
            // for (let i = 0; i < domains.length; i += 1) {
            //   const domain = domains[i]
            //   console.log('domain', domain)
            //   // 检查每个域名是否符合格式
            //   if (!domainRegex.test(domain)) {
            //     return callback(new Error(`域名 "${domain}" 非法`))
            //   }
            // }
            // 如果所有域名都合法，调用回调函数
            callback()
          },
          trigger: ['change', 'blur']
        }
      ]
    })
    // 保存系统域名
    const handleSubmit = (el: any) => {
      console.log('el', el)
      if (!formData.webBindInput)
        return $message('请设置系统域名/IP', 'warning')
      if (!el) return
      el.validate((valid: any, fields: any) => {
        if (valid) {
          chrome.storage.local.set({
            websiteUrlArr: formData.webBindInput
          })
          $message('提交成功', 'success')
          chrome.runtime.sendMessage({
            action: 'setWebsiteUrlArr',
            data: formData.webBindInput
          })
        } else {
          console.log('error submit!', fields)
        }
      })
    }
    // 设置分号
    const inputBlur = () => {
      if (
        formData.webBindInput.charAt(formData.webBindInput.length - 1) === ';'
      )
        return
      formData.webBindInput += ';'
    }
    onMounted(() => {
      // 获取默认系统域名
      chrome.storage.local.get(['websiteUrlArr'], (result: any) => {
        formData.webBindInput = result.websiteUrlArr || ''
      })
    })
    return {
      formData,
      formRef,
      rules,
      handleSubmit,
      inputBlur
    }
  }
})
</script>
<style lang="stylus" scoped>
.page-wrap
  width 498px
  height 100%
  padding 12px 16px
  display flex
  flex-direction column
  align-items center
  justify-content space-around
  box-sizing border-box
  .el-icon
    font-size large
    position absolute
    top 12px
    right 12px
    cursor pointer
  .el-icon:hover
    color #409EFF
  #tips
    color #f56c6c
  .submit-website
    width 100%
    .el-form
      display flex
      flex-direction column
      align-items center
      .el-form-item
        width 100%
        :deep(.el-form-item__error)
          padding-left 124px
      .el-button
        width 25%
        margin-top 8px
</style>
