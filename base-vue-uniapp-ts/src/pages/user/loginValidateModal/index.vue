<template lang="pug">
up-modal.custromModel(
  :show="show"
  :showConfirmButton="false"
  :showCancelButton="false"
)
  template(#default)
    view.modalContent
      .modalBody
        img.img(:src="preview(imgConstant['wx_login_needLogin'])" alt="")
        view.notice {{type==='login' ? '您的操作需要登录并绑定企业！': '您的操作需要先绑定企业！'}}
      .modalBottom
        up-button(
          :text="type==='login' ? '暂不登录': '暂不绑定'"
          shape="circle"
          :customStyle="{background: '#f1f1f1', width: '90%'}"
          @click='handleCancel')
        up-button(
          type="primary"
          :text="type==='login' ? '去登录': '去绑定'"
          :customStyle="{width: '90%'}"
          shape="circle"
          @click='handleConfirm')
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { linkJump } from '@/common/common'
import { preview } from '@/api/common/index'
import imgConstant from '@/common/imgConstant'
let show = ref(false)
const props = defineProps({
  // type 登录提示-login、绑定企业提示-authentication
  type: {
    type: String,
    default: 'login'
  },
  // 是否关闭当前页面打开
  isRedirectTo: {
    type: Boolean,
    default: false
  }
})
const emit = defineEmits(['onCancel'])
const init = () => {
  show.value = true
}
// 取消
const handleCancel = () => {
  show.value = false
  emit('onCancel')
}
// 确定
const handleConfirm = () => {
  if (props.type === 'login') {
    linkJump('/pagesCommon/login/index')
  } else {
    props.isRedirectTo ? linkJump('/pagesUser/enterpriseAuthentication/index', () => {}, 'redirectTo') : linkJump('/pagesUser/enterpriseAuthentication/index')
  }
  show.value = false
}
defineExpose({ init })
</script>

<style lang="stylus" scoped>
@import './index.styl'
</style>
