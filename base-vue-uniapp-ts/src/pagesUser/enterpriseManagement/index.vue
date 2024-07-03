<template lang="pug">
.page-view
  Layout(showTabBar showHeaderBar showBack headerBackground="#DAECFE" statusBackground="#DAECFE" headerTitle="企业管理")
    template(#main)
      view.layoutMain
        .mainContainer
          scroll-view.scrollView(scroll-y)
            view.upFormBox
              up-form(labelPosition="left" labelWidth='110')
                up-form-item(label="当前登录企业")
                  view.formItemH50 {{entInfo.entName || '您还未绑定企业'}}
                up-form-item(label="选择登录企业")
                  CUniappPicker.c-uniapp-picker(:columns="entList" :defaultName="currentEntInfo.entName" keyName="entName" placeholder="请选择企业" @confirm="onEntSelect")
                    template(#right)
                      up-icon(name='arrow-right' color='#909399')
                .tips
                  view.title {{'企业信息'}}
                up-form-item(label="统一社会信用代码" labelWidth='140')
                  view.formItemH50 {{currentEntInfo.entUnitCode || '无'}}
                //- up-form-item(label="信用授权截止日期" labelWidth='140')
                //-   view.formItemH50 {{currentEntInfo.authorizedEndTime ? moment(currentEntInfo.authorizedEndTime).format('YYYY-MM-DD') : '无'}}
                .tips
                  view.title {{'绑定用户信息'}}
                up-form-item(:label="item.name" v-for='item in userList' :key='item.id' )
                  view.formItemH50.unbindBtn
                    up-button(
                      v-if="item.userId === uiasUserInfo.userId"
                      type="primary"
                      text="解绑"
                      @click='handleUnbind(item)')
              view.bottomBtn
                up-button(
                  type="default"
                  text="更换登录企业"
                  :customStyle="{marginBottom: '25rpx', background: '#f1f1f1'}"
                  @click="handleChange")
                up-button(
                  type="primary"
                  text="添加企业"
                  @click="handleAdd")
</template>

<script setup lang="ts">
import Layout from '@/components/layout/index.vue'
import { userCommonStoreHook } from '@/store/modules/common'
import { linkJump } from '@/common/common'
import { computed, ref } from 'vue'
import CUniappPicker from '@/components/c-uniapp-picker/index.vue'
import moment from 'moment'
import { uiasEntInfo, uiasUnbindUser, uiasSwitchEnt, wxUserInfo } from '@/api/user'
import { toast } from '@/common/uni-utils'
import type { EntInfoType, UiasUserInfoType } from '@/api/common/types'
import { onShow } from '@dcloudio/uni-app'
// 用户信息
let uiasUserInfo = userCommonStoreHook().uiasUserInfo as UiasUserInfoType
let entInfo = computed(() => {
  return userCommonStoreHook().entInfo as EntInfoType
})
// 当前绑定企业信息
let currentEntInfo = ref({})
let entList = ref([])
let userList = ref([])
// 选择登录企业
const onEntSelect = (data: AnyObject) => {
  currentEntInfo.value = data
  getEntInfoUias()
}
// 更换登录企业
const handleChange = () => {
  // 绑定同一个企业则return
  if (currentEntInfo.value.userId === entInfo.value.userId) {
    toast.show(`请选择要更换的企业`)
    return
  }
  let params = {
    entUserId: currentEntInfo.value.userId,
    userId: uiasUserInfo.userId
  }
  uiasSwitchEnt(params).then(value => {
    toast.show('更换成功', 'success')
    userCommonStoreHook().setEntInfo(currentEntInfo.value)
  })
}
// 添加企业
const handleAdd = () => {
  linkJump('/pagesUser/enterpriseAuthentication/index')
}
// 获取绑定企业列表
const getEntList = () => {
  let params = {
    userId: uiasUserInfo.userId
  }
  wxUserInfo(params).then(res => {
    let data = res.data || {}
    if (data.entList && data.entList.length) {
      entList.value = data.entList
    } else {
      entList.value = [
        {
          id: 'nodata',
          entName: '您还未绑定企业'
        }
      ]
    }
    console.log('entList', entList.value)
    // 更新当前绑定企业信息
    let currentEnt = entList.value.find(item => item.userId === data.entUserId)
    userCommonStoreHook().setEntInfo(currentEnt || {})
    currentEntInfo.value = currentEnt || {}
    getEntInfoUias()
  })
}
// 获取绑定人列表
const getEntInfoUias = () => {
  if (!currentEntInfo.value.userId) {
    return
  }
  let params = {
    entUserId: currentEntInfo.value.userId
  }
  uiasEntInfo(params).then(value => {
    let data: AnyObject = value.data || {}
    userList.value = data.userList || []
  })
}
// 解绑用户
const handleUnbind = item => {
  uni.showModal({
    content: `您确定解绑${item.name}吗?`,
    success: (result: UniApp.ShowModalRes) => {
      if (result.confirm) {
        let params = {
          entUserId: currentEntInfo.value.userId,
          userId: uiasUserInfo.userId
        }
        uiasUnbindUser(params).then(value => {
          toast.show(value.msg, 'success')
          if (value.entList && value.entList.length) {
            entList.value = value.entList
          } else {
            entList.value = [
              {
                id: 'nodata',
                entName: '您还未绑定企业'
              }
            ]
          }
          // entList.value = value.entList || []
          userList.value = value.userList || []
          // 如果解绑是当前登录企业，则置空
          if (currentEntInfo.value.userId === entInfo.value.userId) {
            userCommonStoreHook().setEntInfo({})
          }
          // 更新当前绑定企业信息
          let currentEnt = entList.value.find((item: EntInfoType) => item.userId === currentEntInfo.value.userId)
          currentEntInfo.value = currentEnt || {}
        })
      }
    }
  })
}
onShow(() => {
  getEntList()
})
</script>

<style lang="stylus" scoped>
@import './index.styl'
</style>
