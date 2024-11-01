<template lang="pug">
.page-view
  Layout(showTabBar showHeaderBar showBack statusBackground="#132B5B" headerBackground="#132B5B" headerColor="#FFFFFF" headerTitle="账号管理")
    template(#main)
      view.layoutMain
        .mainContainer
          scroll-view.scrollView(scroll-y)
            view.upFormBox
              up-form(labelPosition="left" labelWidth='120')
                up-form-item(label="绑定手机号码")
                  up-input(v-model="mobilePhone" border='none' disabled)
              view.bottomBtn.u-big-btn
                up-button.u-default(
                  type="primary"
                  text="更改绑定手机号码"
                  :customStyle="{marginBottom: '25rpx'}"
                  @click="changePhone")
                up-button(
                  type="default"
                  text="切换账号/退出登录"
                  :customStyle="{background: '#FF0000', color: '#ffffff'}"
                  @click="logout")
</template>

<script setup lang="ts">
import Layout from '@/components/layout/index.vue'
import { computed } from 'vue'
import { userCommonStoreHook } from '@/store/modules/common'
import { linkJump } from '@/common/common'
import { maskPhoneNumber } from '@/util/utils'
import Bus, { REFRESH } from '@/common/bus'
// 用户信息
let uiasUserInfo = computed(() => {
  return userCommonStoreHook().uiasUserInfo
})
let mobilePhone = computed(() => {
  return maskPhoneNumber(uiasUserInfo.value.mobilePhone)
})
// 更改绑定手机号码
const changePhone = () => {
  linkJump('/pagesUser/changePhone/index')
}
// 切换账号/退出登录
const logout = () => {
  uni.showModal({
    content: '确定要切换账号/退出登录吗？',
    success: (result: UniApp.ShowModalRes) => {
      if (result.confirm) {
        Bus.$emit(REFRESH, true)
        userCommonStoreHook().logout()
      }
    }
  })
}
</script>

<style lang="stylus" scoped>
@import './index.styl'
</style>
